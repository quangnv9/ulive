export const ValidatePhone = {
  pattern: new RegExp('^([0-9]{7,15}$)$'),
  message: 'Please enter a right phone number',
};
export const ValidateUsername = {
  pattern: new RegExp('^[_A-z0-9;./_:]{6,30}$'),
  message: 'Username must be between 6-30 characters with no space',
};
export const noSpace = '^[_!@#$%^&*(),.?":{}|<>A-z0-9;./_:]{6,30}$';
export const onlyLettersNumbersUnderscoresPeriods = '^[ A-Za-z0-9_.]*$';
export const onlyNumber = '^[0-9]*$';
export const phoneNumber = '^[0-9]{7,15}$';
export const numberOfCharactersShopName = '^[a-zA-Z0-9_ ]{5,30}$';
export const numberOfCharactersShopDescription = '^[a-zA-Z0-9_ ]{50,500}$';
export const numberOfCharactersSenderName = '^[a-zA-Z0-9_ ]{4,30}$';
export const numberOfCharactersAddress = '^[a-zA-Z0-9_ ]{5,125}$';
