export const validateEmail = (email) => {
  const re = /\S+@\S+\.\S+/;
  return re.test(email);
};

export const validatePassword = (password) => {
  // 8-16 chars, 1 uppercase, 1 special char
  const re = /^(?=.*[A-Z])(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,16}$/;
  return re.test(password);
};

export const validateName = (name) => {
  return name.length >= 3 && name.length <= 60;
};

export const validateAddress = (address) => {
  return address.length <= 400;
};
