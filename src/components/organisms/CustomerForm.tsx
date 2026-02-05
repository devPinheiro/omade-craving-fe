import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { useCreateCustomer, useUpdateCustomer } from '@/hooks/useCustomers'
import type {
  AddressType,
  CreateCustomerData,
  Customer,
  CustomerAddress,
  CustomerStatus,
} from '@/types/customer'
import {
  AlertCircle,
  Calendar,
  Mail,
  MapPin,
  Phone,
  Plus,
  Save,
  Tag,
  Trash2,
  User,
  X,
} from 'lucide-react'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'

interface CustomerFormProps {
  customer?: Customer | null
  onSave?: (customer: Customer) => void
  onCancel?: () => void
  isOpen?: boolean
}

type FormData = CreateCustomerData & {
  tags?: string[]
  addresses?: CustomerAddress[]
}

export function CustomerForm({ customer, onSave, onCancel, isOpen = true }: CustomerFormProps) {
  const [tagInput, setTagInput] = useState('')
  const [formError, setFormError] = useState<string>('')
  const [addresses, setAddresses] = useState<CustomerAddress[]>([])

  const createMutation = useCreateCustomer()
  const updateMutation = useUpdateCustomer()

  const isEditing = !!customer
  const isLoading = createMutation.isPending || updateMutation.isPending

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: customer
      ? {
          firstName: customer.firstName,
          lastName: customer.lastName,
          email: customer.email,
          phone: customer.phone || '',
          dateOfBirth: customer.dateOfBirth || '',
          gender: customer.gender,
          status: customer.status,
          notes: customer.notes || '',
          tags: customer.tags || [],
          addresses: customer.addresses || [],
        }
      : {
          status: 'active' as CustomerStatus,
          tags: [],
          addresses: [],
        },
  })

  const watchedTags = watch('tags') || []

  useEffect(() => {
    if (customer) {
      // Reset form with customer data when customer changes
      reset({
        firstName: customer.firstName,
        lastName: customer.lastName,
        email: customer.email,
        phone: customer.phone || '',
        dateOfBirth: customer.dateOfBirth || '',
        gender: customer.gender,
        status: customer.status,
        notes: customer.notes || '',
        tags: customer.tags || [],
        addresses: customer.addresses || [],
      })
      setAddresses(customer.addresses || [])
    } else {
      // Reset to default values when no customer (creating new)
      reset({
        status: 'active' as CustomerStatus,
        tags: [],
        addresses: [],
      })
      setAddresses([])
    }
    setFormError('')
  }, [customer, reset])

  const addTag = () => {
    if (tagInput.trim() && !watchedTags.includes(tagInput.trim())) {
      const newTags = [...watchedTags, tagInput.trim()]
      setValue('tags', newTags)
      setTagInput('')
    }
  }

  const removeTag = (tag: string) => {
    const newTags = watchedTags.filter((t) => t !== tag)
    setValue('tags', newTags)
  }

  const addAddress = () => {
    const newAddress: CustomerAddress = {
      id: `temp-${Date.now()}`,
      customerId: customer?.id || '',
      type: 'shipping' as AddressType,
      firstName: '',
      lastName: '',
      address1: '',
      city: '',
      province: '',
      country: 'NG',
      zip: '',
      isDefault: addresses.length === 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    const newAddresses = [...addresses, newAddress]
    setAddresses(newAddresses)
    setValue('addresses', newAddresses)
  }

  const updateAddress = (index: number, field: keyof CustomerAddress, value: any) => {
    const newAddresses = [...addresses]
    newAddresses[index] = { ...newAddresses[index], [field]: value }
    setAddresses(newAddresses)
    setValue('addresses', newAddresses)
  }

  const removeAddress = (index: number) => {
    const newAddresses = addresses.filter((_, i) => i !== index)
    setAddresses(newAddresses)
    setValue('addresses', newAddresses)
  }

  const setDefaultAddress = (index: number) => {
    const newAddresses = addresses.map((addr, i) => ({
      ...addr,
      isDefault: i === index,
    }))
    setAddresses(newAddresses)
    setValue('addresses', newAddresses)
  }

  const onSubmit = async (data: FormData) => {
    try {
      setFormError('')
      let result: Customer

      const submitData = {
        ...data,
        addresses: addresses,
      }

      if (isEditing && customer) {
        result = await updateMutation.mutateAsync({
          id: customer.id,
          ...submitData,
        })
      } else {
        result = await createMutation.mutateAsync(submitData)
      }

      onSave?.(result)
      if (!isEditing) {
        reset()
        setTagInput('')
        setAddresses([])
      }
    } catch (error) {
      console.error('Failed to save customer:', error)
      setFormError('Failed to save customer. Please try again.')
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            {isEditing ? 'Edit Customer' : 'Add Customer'}
          </h2>
          <Button variant="ghost" size="sm" onClick={onCancel}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
          {formError && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-2">
              <AlertCircle className="h-5 w-5 text-red-600" />
              <span className="text-red-800">{formError}</span>
            </div>
          )}

          {/* Personal Information */}
          <Card className="p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
              <User className="h-5 w-5 mr-2" />
              Personal Information
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">First Name *</label>
                <input
                  {...register('firstName', { required: 'First name is required' })}
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500"
                  placeholder="Enter first name"
                />
                {errors.firstName && (
                  <p className="text-red-500 text-sm mt-1">{errors.firstName.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Last Name *</label>
                <input
                  {...register('lastName', { required: 'Last name is required' })}
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500"
                  placeholder="Enter last name"
                />
                {errors.lastName && (
                  <p className="text-red-500 text-sm mt-1">{errors.lastName.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Mail className="h-4 w-4 inline mr-1" />
                  Email *
                </label>
                <input
                  {...register('email', {
                    required: 'Email is required',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Invalid email address',
                    },
                  })}
                  type="email"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500"
                  placeholder="Enter email address"
                />
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Phone className="h-4 w-4 inline mr-1" />
                  Phone
                </label>
                <input
                  {...register('phone')}
                  type="tel"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500"
                  placeholder="Enter phone number"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Calendar className="h-4 w-4 inline mr-1" />
                  Date of Birth
                </label>
                <input
                  {...register('dateOfBirth')}
                  type="date"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
                <select
                  {...register('gender')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500"
                >
                  <option value="">Select gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>
          </Card>

          {/* Status & Settings */}
          <Card className="p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Status & Settings</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Customer Status
                </label>
                <select
                  {...register('status', { required: 'Status is required' })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="suspended">Suspended</option>
                  <option value="pending">Pending</option>
                </select>
                {errors.status && (
                  <p className="text-red-500 text-sm mt-1">{errors.status.message}</p>
                )}
              </div>
            </div>
          </Card>

          {/* Tags */}
          <Card className="p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
              <Tag className="h-5 w-5 mr-2" />
              Tags
            </h3>

            <div className="space-y-4">
              <div className="flex flex-wrap gap-2">
                {watchedTags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="ml-2 text-blue-600 hover:text-blue-800"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500"
                  placeholder="Add tag..."
                />
                <Button type="button" onClick={addTag} variant="outline" size="sm">
                  Add
                </Button>
              </div>
            </div>
          </Card>

          {/* Addresses */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900 flex items-center">
                <MapPin className="h-5 w-5 mr-2" />
                Addresses
              </h3>
              <Button type="button" onClick={addAddress} variant="outline" size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add Address
              </Button>
            </div>

            {addresses.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <MapPin className="h-12 w-12 mx-auto text-gray-300 mb-4" />
                <p>No addresses added yet</p>
                <p className="text-sm">Add an address to get started</p>
              </div>
            ) : (
              <div className="space-y-6">
                {addresses.map((address, index) => (
                  <div key={address.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-medium text-gray-900">
                          Address {index + 1}
                        </span>
                        {address.isDefault && (
                          <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                            Default
                          </span>
                        )}
                      </div>
                      <div className="flex items-center space-x-2">
                        {!address.isDefault && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => setDefaultAddress(index)}
                            className="text-sm"
                          >
                            Set as default
                          </Button>
                        )}
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeAddress(index)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Address Type
                        </label>
                        <select
                          value={address.type}
                          onChange={(e) => updateAddress(index, 'type', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500"
                        >
                          <option value="shipping">Shipping</option>
                          <option value="billing">Billing</option>
                          <option value="both">Both</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Company
                        </label>
                        <input
                          type="text"
                          value={address.company || ''}
                          onChange={(e) => updateAddress(index, 'company', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500"
                          placeholder="Company name (optional)"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          First Name
                        </label>
                        <input
                          type="text"
                          value={address.firstName}
                          onChange={(e) => updateAddress(index, 'firstName', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500"
                          placeholder="First name"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Last Name
                        </label>
                        <input
                          type="text"
                          value={address.lastName}
                          onChange={(e) => updateAddress(index, 'lastName', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500"
                          placeholder="Last name"
                        />
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Address Line 1
                        </label>
                        <input
                          type="text"
                          value={address.address1}
                          onChange={(e) => updateAddress(index, 'address1', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500"
                          placeholder="Street address"
                        />
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Address Line 2
                        </label>
                        <input
                          type="text"
                          value={address.address2 || ''}
                          onChange={(e) => updateAddress(index, 'address2', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500"
                          placeholder="Apartment, suite, etc. (optional)"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                        <input
                          type="text"
                          value={address.city}
                          onChange={(e) => updateAddress(index, 'city', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500"
                          placeholder="City"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          State
                        </label>
                        <input
                          type="text"
                          value={address.province}
                          onChange={(e) => updateAddress(index, 'province', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500"
                          placeholder="State/Province"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          ZIP Code
                        </label>
                        <input
                          type="text"
                          value={address.zip}
                          onChange={(e) => updateAddress(index, 'zip', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500"
                          placeholder="ZIP/Postal code"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Phone
                        </label>
                        <input
                          type="tel"
                          value={address.phone || ''}
                          onChange={(e) => updateAddress(index, 'phone', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500"
                          placeholder="Phone number (optional)"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>

          {/* Notes */}
          <Card className="p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Notes</h3>
            <textarea
              {...register('notes')}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500"
              placeholder="Add any additional notes about this customer..."
            />
          </Card>

          {/* Actions */}
          <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading} className="bg-green-600 hover:bg-green-700">
              {isLoading ? (
                <>Loading...</>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  {isEditing ? 'Update' : 'Create'} Customer
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
