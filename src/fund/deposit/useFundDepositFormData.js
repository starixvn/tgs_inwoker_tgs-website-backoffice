import { usePaymentMethodList } from "../../payment/method/client"
import { usePlayer } from "../../player-management/player-list/client"
import { useBrandPayment } from "../../system/brandpayments/client"
import { useFundDepositForm } from "./client"

export const useFundDepositFormData = (brandId, formId, playerCode) => {
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

  let {
    data: paymentMethodList,
    isLoading: isLoadingPaymentMethodList,
    error: paymentMethodListError
  } = usePaymentMethodList()

  let paymentMethod = paymentMethodList?.find(
    (paymentMethod) => paymentMethod.id === brandPayment?.paymentMethodId
  )

  let {
    data: player,
    isLoading: isLoadingPlayer,
    error: playerError,
    mutate: mutatePlayer,
    deleteCache: deletePlayerCache
  } = usePlayer(playerCode)

  return {
    depositForm,
    brandPayment,
    paymentMethod,
    player,
    isLoading:
      isLoadingDepositForm ||
      isLoadingBrandPayment ||
      isLoadingPaymentMethodList ||
      isLoadingPlayer,
    error:
      depositFormError ||
      brandPaymentError ||
      paymentMethodListError ||
      playerError,
    mutateDepositForm,
    mutateBrandPayment,
    deleteDepositFormCache,
    deleteBrandPaymentCache
  }
}
