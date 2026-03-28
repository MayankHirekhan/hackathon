// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract PacketTrace {

 struct Packet {
  string packetId;
  string herbName;
  string hash;
 }

 mapping(string => Packet) public packets;

 event PacketStored(string packetId,string hash);

 function storePacket(
  string memory packetId,
  string memory herbName,
  string memory hash
 ) public {

  packets[packetId] = Packet(packetId,herbName,hash);

  emit PacketStored(packetId,hash);

 }

}