import { useState } from "react"

export const usePasswordRules = (password: string) => {
  const [showRules, setShowRules] = useState(false)
  
  const passwordRules = [
    {
      text: "At least 8 characters",
      valid: password.length >= 8
    },
    {
      text: "One lowercase letter",
      valid: /[a-z]/.test(password)
    },
    {
      text: "One uppercase letter",
      valid: /[A-Z]/.test(password)
    },
    {
      text: "One number",
      valid: /\d/.test(password)
    }
  ]
  
  return {
    showRules,
    setShowRules,
    passwordRules
  }
}
