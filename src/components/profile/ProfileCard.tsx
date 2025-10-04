import React from "react";
import { User } from "../../types/user";

interface Props {
  user: User;
}

const ProfileCard: React.FC<Props> = ({ user }) => (
  <div className="profileCardRoot">
    <h2 className="profileCardTitle">
      {user.name} – #{user.jerseyNumber} ({user.role})
    </h2>
    <div className="profileCardEmail">
      <b>Email:</b> {user.email}
    </div>
    <div className="profileCardIce">
      <b>ICE-kontakt:</b> {user.iceContacts[0]?.name} ({user.iceContacts[0]?.relation}), {user.iceContacts[0]?.phone}
    </div>
    <div className="profileCardAbout">
      <b>Om mig:</b> {user.about || <i>Ej ifyllt</i>}
    </div>
    <div className={`profileCardStatus ${user.isApproved ? 'profileCardStatusApproved' : 'profileCardStatusPending'}`}>
      {user.isApproved ? "✔️ Godkänd" : "⏳ Väntar på godkännande"}
    </div>
  </div>
);

export default ProfileCard;