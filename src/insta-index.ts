import { BigInt, DataSourceContext } from "@graphprotocol/graph-ts";
import {
  InstaIndex,
  LogAccountCreated,
  LogNewAccount,
  LogNewCheck,
  LogNewMaster,
  LogUpdateMaster,
} from "../generated/undefined/InstaIndex";
import { DSA } from "../generated/schema";
import { InstaAccount } from "../generated/undefined/InstaAccount";
import { InstaList } from "../generated/undefined/InstaList";
import { InstaAccount as InstaAccountABI } from "../generated/templates";

export function handleLogAccountCreated(event: LogAccountCreated): void {
  // event LogAccountCreated(address sender, address indexed owner, address indexed account, address indexed origin);

  let context = new DataSourceContext();
  context.setString("dsa", event.params.account.toHexString());
  InstaAccountABI.createWithContext(event.params.account, context);

  let contract = InstaIndex.bind(event.address);
  let instaAccount = InstaAccount.bind(event.params.account);
  let instaList = InstaList.bind(contract.list());
  let accountId = instaList.accountID(event.params.account);

  let dsa = createOrLoadDsa(event.params.account.toHexString());

  dsa.creator = event.params.owner;
  dsa.address = event.params.account;
  dsa.version = instaAccount.version();
  dsa.accountID = accountId;
  dsa.save();
}

export function createOrLoadDsa(id: string): DSA {
  let dsa = DSA.load(id);
  if (dsa == null) {
    dsa = new DSA(id);
    dsa.eventsNames = [];
    dsa.eventsParams = [];
    dsa.targetNames = [];
    // dsa.targets = [];
  }
  return dsa;
}
