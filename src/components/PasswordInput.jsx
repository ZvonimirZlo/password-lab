const PasswordInput = ({ password, setPassword }) => {
  return (
    <div>
       <input
        type="password"
        placeholder="Type a password to test..."
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
    </div>
  )
}

export default PasswordInput