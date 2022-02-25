import React from "react";
import { Badge } from "./Badge";

interface BadgeCardProps {
    title?: string;
    description?: string;
    image: string;
    id: string;
}

export const BadgeCard = ({
    image,
    id,
    ...props
}: BadgeCardProps) => {
    return <div className="w-[200px] text-center space-y-5">
        <div className="flex justify-center">
            <Badge image={image} size="middle" title={props.title} description={props.description}/>
        </div>
        <p className="text-2xl">{props.title}</p>
        <p className="">{props.description}</p>
    </div>
}