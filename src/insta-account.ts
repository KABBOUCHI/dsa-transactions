import {
  Address,
  BigInt,
  Bytes,
  dataSource,
  log,
} from "@graphprotocol/graph-ts";
import {
  LogCast,
  InstaAccount,
} from "../generated/templates/InstaAccount/InstaAccount";
import { DSA } from "../generated/schema";

export function handleLogCast(event: LogCast): void {
  let context = dataSource.context();
  let id = context.getString("dsa");

  log.info("transaction hash: {} and from: {} ", [
    event.transaction.hash.toHexString(),
    event.transaction.from.toHexString(),
  ]);
  log.info("ID: {}", [id]);

  let dsa = DSA.load(id);
  if (dsa == null) {
    dsa = new DSA(id);
    dsa.eventsNames = [];
    dsa.eventsParams = [];
    dsa.targetNames = [];
    // dsa.targets = [];
    dsa.address = event.transaction.from;
    dsa.version = BigInt.fromI32(0);
    dsa.accountID = BigInt.fromI32(0);
  }

  dsa.eventsNames = event.params.eventNames;
  dsa.eventsParams = event.params.eventParams;
  dsa.targetNames = event.params.targetsNames;
  // dsa.targets = event.params.targets;

  dsa.save();
}
