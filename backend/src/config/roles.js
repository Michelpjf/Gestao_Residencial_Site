export const BUSINESS_ROLES = Object.freeze([
  'admin',
  'gerente',
  'gestor',
  'financeiro',
  'manutencao',
]);

const businessRoleSet = new Set(BUSINESS_ROLES);

export function isBusinessRole(value) {
  return typeof value === 'string' && businessRoleSet.has(value);
}
