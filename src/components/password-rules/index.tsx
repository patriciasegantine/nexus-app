import { Check } from "lucide-react"

interface PasswordRulesProps {
  rules: {
    text: string
    valid: boolean
  }[]
}

export function PasswordRules({ rules }: PasswordRulesProps) {
  return (
    <div className="bg-muted/50 rounded-lg p-4 space-y-2">
      {rules.map((rule, index) => (
        <div
          key={index}
          className={`flex items-center gap-2 text-sm transition-colors ${
            rule.valid
              ? 'text-muted-foreground'
              : 'text-muted-foreground/60'
          }`}
        >
          <Check className={`h-4 w-4 ${
            rule.valid
              ? 'text-green-500'
              : 'text-muted-foreground/30'
          }`} />
          <span>{rule.text}</span>
        </div>
      ))}
    </div>
  )
}
