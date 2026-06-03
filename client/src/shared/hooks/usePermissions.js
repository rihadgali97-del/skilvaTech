import { useAuthStore } from '../../store/authStore';

export const usePermissions = () => {
  const { hasPermission, hasRole, user } = useAuthStore();
  return {
    can:          (permission)    => hasPermission(permission),
    canAny:       (...permissions) => permissions.some((p)  => hasPermission(p)),
    canAll:       (...permissions) => permissions.every((p) => hasPermission(p)),
    is:           (...roles)      => hasRole(...roles),
    isSuperAdmin: ()              => hasRole('super_admin'),
    isAdmin:      ()              => hasRole('super_admin', 'admin'),
    isInstructor: ()              => hasRole('instructor'),
    isStudent:    ()              => hasRole('student'),
    user,
  };
};
