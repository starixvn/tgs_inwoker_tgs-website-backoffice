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
    data: player,
    isLoading: isLoadingPlayer,
    error: playerError,
    mutate: mutatePlayer,
    deleteCache: deletePlayerCache
  } = usePlayer(playerCode)

  return {
    depositForm,
    brandPayment,
    player,
    isLoading: isLoadingDepositForm || isLoadingBrandPayment || isLoadingPlayer,
    error: depositFormError || brandPaymentError || playerError,
    mutateDepositForm,
    mutateBrandPayment,
    deleteDepositFormCache,
    deleteBrandPaymentCache
  }
}
