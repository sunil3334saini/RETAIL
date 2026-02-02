/**
 * AuthService - Manages user authentication and session
 * Handles login, register, logout, and user persistence
 */

class AuthService {
  /**
   * Register new user
   */
  static register(email, password, name) {
    if (!email || !password || !name) {
      throw new Error('All fields are required');
    }
    
    const users = this.getAllUsers();
    
    if (users.find(u => u.email === email)) {
      throw new Error('User already exists');
    }

    const newUser = {
      id: 'user-' + Math.random().toString(36).substr(2, 9),
      email,
      password, // In production, hash this
      name,
      createdAt: new Date().toISOString()
    };

    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    this.setCurrentUser(newUser);

    return newUser;
  }

  /**
   * Login user
   */
  static login(email, password) {
    const users = this.getAllUsers();
    const user = users.find(u => u.email === email && u.password === password);

    if (!user) {
      throw new Error('Invalid email or password');
    }

    this.setCurrentUser(user);
    return user;
  }

  /**
   * Logout user
   */
  static logout() {
    localStorage.removeItem('currentUser');
  }

  /**
   * Get current logged-in user
   */
  static getCurrentUser() {
    const user = localStorage.getItem('currentUser');
    return user ? JSON.parse(user) : null;
  }

  /**
   * Set current user
   */
  static setCurrentUser(user) {
    localStorage.setItem('currentUser', JSON.stringify(user));
  }

  /**
   * Check if user is authenticated
   */
  static isAuthenticated() {
    return this.getCurrentUser() !== null;
  }

  /**
   * Get all users
   */
  static getAllUsers() {
    const users = localStorage.getItem('users');
    return users ? JSON.parse(users) : [];
  }

  /**
   * Get user by ID
   */
  static getUserById(userId) {
    const users = this.getAllUsers();
    return users.find(u => u.id === userId);
  }
}

export default AuthService;
