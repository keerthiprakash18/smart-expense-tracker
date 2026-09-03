function Login() {
  return (
    <div className="login-container">
      <h2>Login</h2>

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

      <button>Login</button>

      <p>
        Don't have an account? Register
      </p>
    </div>
  );
}

export default Login;