import { useBrandPayment } from "../../system/brandpayments/client"
import { useFundDepositForm } from "./client"

export const useFundDepositFormData = (brandId, formId) => {
  let {
    data: depositForm,
    isLoading: isLoadingDepositForm,
    error: depositFormError,
    mutate: mutateDepositForm,
    deleteCache: deleteDepositFormCache
  } = useFundDepositForm(brandId, formId)
  let {
    data: brandPayment,
    isLoading: isLoadingBrandPayment,
    error: brandPaymentError,
    mutate: mutateBrandPayment,
    deleteCache: deleteBrandPaymentCache
  } = useBrandPayment(depositForm?.brandPaymentId)

  return {
    depositForm,
    brandPayment,
    isLoading: isLoadingDepositForm || isLoadingBrandPayment,
    error: depositFormError || brandPaymentError,
    mutateDepositForm,
    mutateBrandPayment,
    deleteDepositFormCache,
    deleteBrandPaymentCache
  }
}
