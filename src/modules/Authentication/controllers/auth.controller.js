import * as authService from "../services/auth.service.js";
import { StatusCodes } from "http-status-codes";

export const signupStudent = async (req, res, next) => {
  try {
    const userData = req.validatedBody;

    const result = await authService.registerStudent(userData);
    
    res.status(StatusCodes.CREATED).json({
      success: result.success,
      message: result.message,
      data: {
        userId: result.data.userId,
        email: result.data.email,
        role: result.data.role
      }
    });
  } catch (error) {
    next(error);
  }
};

export const signupCompanySupervisor = async (req, res, next) => {
  try {
    const userData = req.validatedBody;

    const result = await authService.registerCompanySupervisor(userData);

    res.status(StatusCodes.CREATED).json({
      success: result.success,
      message: result.message,
      data: {
        userId: result.data.userId,
        email: result.data.email,
        role: result.data.role
      }
    });
  } catch (error) {
    next(error);
  }
};

export const signupUniversitySupervisor = async (req, res, next) => {
  try {
    const userData = req.validatedBody;

    const result = await authService.registerUniversitySupervisor(userData);

    res.status(StatusCodes.CREATED).json({
      success: result.success,
      message: result.message,
      data: {
        userId: result.data.userId,
        email: result.data.email,
        role: result.data.role
      }
    });
  } catch (error) {
    next(error);
  }
};

export const verifyEmail = async (req, res, next) => {
  try {
    // Support both query parameter and body
    const token = req.query.token || req.validatedBody?.token || req.body?.token;
    
    if (!token) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: "Verification token is required"
      });
    }
    
    const result = await authService.verifyEmail(token);
    
    res.status(StatusCodes.OK).json({
      success: result.success,
      message: result.message
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const loginData = req.validatedBody;
    
    const result = await authService.login(loginData);
    
    res.cookie('refreshToken', result.data.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });
    
    res.status(StatusCodes.OK).json({
      success: result.success,
      message: result.message,
      data: {
        user: result.data.user,
        accessToken: result.data.accessToken
        // Refresh token is sent as HTTP-only cookie
      }
    });
  } catch (error) {
    next(error);
  }
};

export const logout = async (req, res, next) => {
  try {
    const userId = req.user?.id;
    
    const result = await authService.logout(userId);
    
    res.clearCookie('refreshToken');
    
    res.status(StatusCodes.OK).json({
      success: result.success,
      message: result.message
    });
  } catch (error) {
    next(error);
  }
};

export const refreshToken = async (req, res, next) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    console.log("Refresh Token:", refreshToken);
    if (!refreshToken) {
      const error = new Error("Refresh token not provided");
      error.status = StatusCodes.UNAUTHORIZED;
      throw error;
    }
    
    const result = await authService.refreshAccessToken(refreshToken);
    
    res.status(StatusCodes.OK).json({
      success: result.success,
      message: result.message,
      data: {
        accessToken: result.data.accessToken
      }
    });
  } catch (error) {
    next(error);
  }
};

export const requestPasswordReset = async (req, res, next) => {
  try {
    const { email } = req.validatedBody;
    
    const result = await authService.requestPasswordReset(email);
    
    res.status(StatusCodes.OK).json({
      success: result.success,
      message: result.message,
      // Only include reset token in development
      ...(process.env.NODE_ENV === 'development' && result.resetToken && {
        resetToken: result.resetToken
      })
    });
  } catch (error) {
    next(error);
  }
};

export const resetPassword = async (req, res, next) => {
  try {
    const resetToken = req.query.resetToken;
    const { newPassword } = req.validatedBody;
    
    if (!resetToken) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: "Reset token is required"
      });
    }
    
    const result = await authService.resetPassword(resetToken, newPassword);
    
    res.status(StatusCodes.OK).json({
      success: result.success,
      message: result.message
    });
  } catch (error) {
    next(error);
  }
};
