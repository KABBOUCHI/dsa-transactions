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
import { DSA, Events } from "../generated/schema";
import { createOrLoadEvent, createOrLoadDsa } from "./insta-index";

export function handleLogCast(event: LogCast): void {
  let context = dataSource.context();
  let id = context.getString("dsa");
  let eventId = event.transaction.hash.toHexString();

  log.info("transaction hash: {} and from: {} ", [
    event.transaction.hash.toHexString(),
    event.transaction.from.toHexString(),
  ]);
  log.info("ID: {}", [id]);

  let dsa = createOrLoadDsa(id);
  let cast_events = createOrLoadEvent(eventId);
  cast_events.eventsNames = event.params.eventNames;
  cast_events.eventsParams = event.params.eventParams;
  cast_events.targetNames = event.params.targetsNames;
  cast_events.blockNumber = event.block.number;
  cast_events.timestamp = event.block.timestamp;
  cast_events.gasUsed = event.block.gasUsed;
  cast_events.sender = event.params.sender;
  cast_events.origin = event.params.origin;
  cast_events.value = event.params.value;
  cast_events.eventIndex = event.logIndex;
  cast_events.txnIndex=event.transaction.index;
  cast_events.txnLogIndex = event.transactionLogIndex;
  cast_events.nonce = event.transaction.nonce;

  let events = dsa.events;
  events.push(cast_events.id);
  dsa.events = events;
  // dsa.targets = event.params.targets;

  dsa.save();
  cast_events.save();
}
