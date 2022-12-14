import React, { useState } from "react"
import { useBrandPaymentList } from "../system/brandpayments/client"
import { PaymentProviderSelect } from "./PaymentProvider"
// import PlatformPaymentTransferType from "../system/brandpayments/BrandPaymentTransferType"
export { default as PlatformPaymentTransferType } from "../system/brandpayments/BrandPaymentTransferType"

// export const PlatformPaymentTransferType = PlatformPaymentTransferType

export const PlatformPaymentProviderSelect = ({
  brandId,
  transferType,
  ...props
}) => {
  let { isLoading, data, error } = useBrandPaymentList(
    brandId
      ? {
          brandId,
          transferType,
          sortby: "number",
          showAll: true
        }
      : undefined
  )

  let platformPaymentIds = data?.items?.map(({ paymentId }) => paymentId)
  return (
    <PaymentProviderSelect
      isLoading={isLoading}
      filter={(paymentProvider) => {
        if (!platformPaymentIds) {
          return true
        }

        return platformPaymentIds.includes(paymentProvider.id)
      }}
      {...props}
    />
  )
}
