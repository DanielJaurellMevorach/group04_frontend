import { Shield, Lock, CreditCard } from "lucide-react"

export function PaymentSecurity() {
  return (
    <div className="bg-[#EFE6DC] p-6 rounded-none">
      <h3 className="font-medium text-[#8A5A3B] mb-4 flex items-center gap-2">
        <Shield className="h-5 w-5" />
        Your Security is Our Priority
      </h3>
      <div className="space-y-3 text-sm text-[#A67C52]">
        <div className="flex items-start gap-2">
          <Lock className="h-4 w-4 mt-0.5 text-[#C8977F]" />
          <span>256-bit SSL encryption protects your personal information</span>
        </div>
        <div className="flex items-start gap-2">
          <CreditCard className="h-4 w-4 mt-0.5 text-[#C8977F]" />
          <span>PCI DSS compliant payment processing</span>
        </div>
        <div className="flex items-start gap-2">
          <Shield className="h-4 w-4 mt-0.5 text-[#C8977F]" />
          <span>We never store your credit card information</span>
        </div>
      </div>
    </div>
  )
}