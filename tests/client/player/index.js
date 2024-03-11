import { adjustBalance, addBalance, deductBalance } from "./adjustBalance.js"
import { getPlayer } from "./getPlayer.js"
import { updateInfo, updatePlayerAgent } from "./updateInfo.js"
import { updateContact } from "./updateContact.js"
import { applyBankManualDepositForm } from "./applyBankManualDepositForm.js"
import bankCard from "./bankCard.js"
import bucket from "./bucket.js"
import * as balanceChange from "./balanceChange.js"
import { upgradeToAgent } from "./upgradeToAgent.js"

export default {
  getPlayer,
  adjustBalance,
  addBalance,
  deductBalance,
  updateInfo,
  updatePlayerAgent,
  updateContact,
  applyBankManualDepositForm,
  bankCard,
  bucket,
  balanceChange,
  upgradeToAgent
}
