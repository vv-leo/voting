import React from "react";
import Image from "next/image";

import Style from "../card/card.module.css";
import image from "../../candidate.png";
import voterCardStyle from "./voterCard.module.css";

const voterCard = ({ voterArray }) => {
  return (
    <div className={Style.card}>
      {voterArray?.map((el, i) => (
        <div className={Style.card_box}>
          <div className={Style.image}>
            <img src={el?.image} alt="Profile photo" />
          </div>

          <div className={Style.card_info}>
            <h2>
              {el?.name} #{el?.voterID}
            </h2>
            <p>Address: {el?.address.slice(0, 30)}..</p>
            <p>
              Over the years, I have acquired relevant skills and experience.
            </p>
            <p className={voterCardStyle.vote_Status}>
              {el?.votingStatus == true ? "You Already Voted" : "Not Voted"}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default voterCard;
