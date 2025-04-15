import React from "react";
import TrainCard from "./TrainCard";
import { Train } from "@/api/trainApi";

export default function TrainCardList({ trains }: { trains: Train[] }) {
  return (
    <div>
      {trains.map((train) => (
        <TrainCard key={train.id} train={train} />
      ))}
    </div>
  );
}
