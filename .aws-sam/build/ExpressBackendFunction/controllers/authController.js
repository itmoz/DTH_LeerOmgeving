export const login = (req, res) => {
  res.json({ message: "login stub" });
};

export const register = (req, res) => {
  res.json({ message: "register stub" });
};

export const getUser = (req, res) => {
  res.json({ user: { id: 1, name: "Test Gebruiker" } });
};

export const getBalance = (req, res) => {
  res.json({ balance: 0 });
};

// export const addBalance = (req, res) => {
//   res.json({ message: "balance added (stub)" });
// };

export const logout = (req, res) => {
  res.json({ message: "logout stub" });
};