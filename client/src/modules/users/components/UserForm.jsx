import { useState, useEffect } from 'react';
import { Button, FormField, Input, Select } from '../../../shared/components/ui/index';

const UserForm = ({ onSubmit, onCancel, roles = [], initialData = null, loading }) => {
  const isEdit = !!initialData;

  const [form, setForm] = useState({
    firstName: '',
    lastName:  '',
    email:     '',
    password:  '',
    roleId:    '',
    phone:     '',
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      setForm({
        firstName: initialData.firstName || '',
        lastName:  initialData.lastName  || '',
        email:     initialData.email     || '',
        password:  '',
        roleId:    initialData.role?.id  || '',
        phone:     initialData.phone     || '',
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const validate = () => {
    const newErrors = {};
    if (!form.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!form.lastName.trim())  newErrors.lastName  = 'Last name is required';
    if (!form.email.trim())     newErrors.email     = 'Email is required';
    if (!isEdit && !form.password) newErrors.password = 'Password is required';
    if (!isEdit && form.password.length < 8) newErrors.password = 'Min 8 characters';
    if (!form.roleId)           newErrors.roleId    = 'Role is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    const payload = { ...form };
    if (isEdit && !payload.password) delete payload.password;

    try {
      await onSubmit(payload);
    } catch (err) {
      const message = err.response?.data?.error?.message || 'Something went wrong';
      setErrors({ submit: message });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {errors.submit && (
        <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
          {errors.submit}
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        <FormField label="First Name" error={errors.firstName} required>
          <Input name="firstName" value={form.firstName} onChange={handleChange}
            placeholder="John" error={errors.firstName} />
        </FormField>
        <FormField label="Last Name" error={errors.lastName} required>
          <Input name="lastName" value={form.lastName} onChange={handleChange}
            placeholder="Doe" error={errors.lastName} />
        </FormField>
      </div>

      <FormField label="Email" error={errors.email} required>
        <Input name="email" type="email" value={form.email} onChange={handleChange}
          placeholder="john@example.com" error={errors.email}
          disabled={isEdit} />
      </FormField>

      <FormField
        label={isEdit ? 'New Password (leave blank to keep current)' : 'Password'}
        error={errors.password}
        required={!isEdit}
      >
        <Input name="password" type="password" value={form.password} onChange={handleChange}
          placeholder={isEdit ? '••••••••' : 'Min 8 chars, 1 uppercase, 1 number'}
          error={errors.password} />
      </FormField>

      <FormField label="Phone" error={errors.phone}>
        <Input name="phone" value={form.phone} onChange={handleChange}
          placeholder="+1 234 567 8900" />
      </FormField>

      <FormField label="Role" error={errors.roleId} required>
        <Select name="roleId" value={form.roleId} onChange={handleChange} error={errors.roleId}>
          <option value="">Select a role</option>
          {roles.map((role) => (
            <option key={role.id} value={role.id}>{role.name}</option>
          ))}
        </Select>
      </FormField>

      <div className="flex gap-3 justify-end pt-2">
        <Button variant="secondary" onClick={onCancel} type="button">Cancel</Button>
        <Button type="submit" loading={loading}>
          {isEdit ? 'Save Changes' : 'Create User'}
        </Button>
      </div>
    </form>
  );
};

export default UserForm;