export function validateCreateTalentDto(createTalentDto: any): string | null {
  if (!createTalentDto.password) {
    return 'Password is required';
  } else if (!createTalentDto.name) {
    return 'Name is required';
  } else if (!createTalentDto.email) {
    return 'Email is required';
  } else if (!createTalentDto.nick_name) {
    return 'Nick name is required';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(createTalentDto.email)) {
    return 'Invalid email format';
  }
  return null; // No validation errors
}
