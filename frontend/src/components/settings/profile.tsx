import { useEffect, useRef, useState } from 'react'

import { UploadCloudIcon, TrashIcon, ImageIcon } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useAuth } from '@/context/auth-context'

const PersonalInfo = () => {
  const { user } = useAuth()
  const inputRef = useRef<HTMLInputElement | null>(null)
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    fullName: user?.fullName || '',
    cin: user?.profile?.cin || '',
    phoneNumber: user?.phoneNumber || '',
    companyName: user?.profile?.companyName || '',
    degree: user?.profile?.degree || '',
    field: user?.profile?.degreeType || ''
  })

  useEffect(() => {
    if (user) {
      setFormData({
        fullName: user.fullName || '',
        cin: user.profile?.cin || '',
        phoneNumber: user.phoneNumber || '',
        companyName: user.profile?.companyName || '',
        degree: user.profile?.degree || '',
        field: user.profile?.degreeType || ''
      })
    }
  }, [user])

  useEffect(() => {
    if (!file) {
      const t = window.setTimeout(() => setPreview(null), 0)

      return () => clearTimeout(t)
    }

    const url = URL.createObjectURL(file)

    const t = window.setTimeout(() => setPreview(url), 0)

    return () => {
      clearTimeout(t)
      URL.revokeObjectURL(url)
    }
  }, [file])

  const onSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]

    if (!f) return

    if (!f.type.startsWith('image/')) {
      window.alert('Please select an image file')
      e.currentTarget.value = ''

      return
    }

    if (f.size > 1024 * 1024) {
      window.alert('File must be smaller than 1MB')
      e.currentTarget.value = ''

      return
    }

    setFile(f)
  }

  const openPicker = () => inputRef.current?.click()

  const remove = () => {
    setFile(null)
    if (inputRef.current) inputRef.current.value = ''
  }

  return (
    <div className='grid grid-cols-1 gap-10 lg:grid-cols-3'>
      {/* Vertical Tabs List */}
      <div className='flex flex-col space-y-1'>
        <h3 className='font-semibold'>Personal Information</h3>
        <p className='text-muted-foreground text-sm'>Manage your personal information and role.</p>
      </div>

      {/* Content */}
      <div className='space-y-6 lg:col-span-2'>
        <form className='mx-auto'>
          <div className='mb-6 w-full space-y-2'>
            <Label>Your Avatar</Label>
            <div className='flex items-center gap-4'>
              <div
                role='button'
                tabIndex={0}
                aria-label='Upload your avatar'
                onClick={openPicker}
                onKeyDown={e => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault()
                    openPicker()
                  }
                }}
                className='flex h-20 w-20 cursor-pointer items-center justify-center overflow-hidden rounded-full border border-dashed hover:opacity-95'
              >
                {preview ? (
                  <img src={preview} alt='avatar preview' className='h-full w-full object-cover' />
                ) : (
                  <ImageIcon />
                )}
              </div>

              <div className='flex items-center gap-2'>
                <input ref={inputRef} type='file' accept='image/*' className='hidden' onChange={onSelect} />
                <Button type='button' variant='outline' onClick={openPicker} className='flex items-center gap-2'>
                  <UploadCloudIcon />
                  Upload avatar
                </Button>
                <Button type='button' variant='ghost' onClick={remove} disabled={!file} className='text-destructive'>
                  <TrashIcon />
                </Button>
              </div>
            </div>
            <p className='text-muted-foreground text-sm'>Pick a photo up to 1MB.</p>
          </div>
          <div className='grid grid-cols-1 gap-6 sm:grid-cols-2'>
            <div className='flex flex-col items-start gap-2'>
              <Label htmlFor='multi-step-personal-info-first-name'>Full Name</Label>
              <Input id='multi-step-personal-info-first-name' value={formData.fullName} readOnly />
            </div>
            {user?.role === 'Student' && (
              <div className='flex flex-col items-start gap-2'>
                <Label htmlFor='multi-step-personal-info-last-name'>Cin</Label>
                <Input id='multi-step-personal-info-last-name' value={formData.cin} readOnly />
              </div>
            )}
            <div className='flex flex-col items-start gap-2'>
              <Label htmlFor='multi-step-personal-info-mobile'>Mobile</Label>
              <Input id='multi-step-personal-info-mobile' type='tel' value={formData.phoneNumber} readOnly />
            </div>
            <div className='flex flex-col items-start gap-2'>
              <Label htmlFor='multi-step-personal-info-company-name'>Company Name</Label>
              <Input id='multi-step-personal-info-company-name' value={formData.companyName} readOnly />
            </div>
            <div className='flex flex-col items-start gap-2'>
              <Label htmlFor='multi-step-personal-info-company-name'>Degree</Label>
              <Input id='multi-step-personal-info-company-name' value={formData.degree} readOnly />
            </div>
            <div className='flex flex-col items-start gap-2'>
              <Label htmlFor='multi-step-personal-info-company-name'>Field</Label>
              <Input id='multi-step-personal-info-company-name' value={formData.field} readOnly />
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

export default PersonalInfo