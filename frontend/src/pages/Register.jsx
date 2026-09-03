function Register() {
  return (
    <div className="register-container">
      <h2>Create Account</h2>

      <input
        type="text"
        placeholder="Enter your name"
      />

      <br />
      <br />

      <input
        type="email"
        placeholder="Enter your email"
      />

      <br />
      <br />

      <input
        type="password"
        placeholder="Enter your password"
      />

      <br />
      <br />

      <input
        type="password"
        placeholder="Confirm your password"
      />

      <br />
      <br />

      <button>Register</button>

      <p>
        Already have an account? Login
      </p>
    </div>
  );
}

export default Register;