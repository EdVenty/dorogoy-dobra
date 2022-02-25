import React, { useRef, useState, useEffect } from "react";
import pen from './pen.svg';

interface TextBlockProps{
    defaultValue?: string;
    className?: string,
    onSet?: (value: string) => void,
    name?: string,
    editable?: boolean
}

export const TextBlock = ({
    defaultValue = "",
    className = "",
    onSet = (value) => {},
    name = "",
    editable = true
}: TextBlockProps) => {
    const [ editing, setEditing ] = useState(false);
    const [ value, setValue ] = useState(defaultValue);
    const ref = useRef<HTMLInputElement>(null);
    useEffect(() => {
        const listener = (ev: KeyboardEvent) => {
            if(ev.key === "Enter" && editing){
                onSet(value);
                setEditing(false);
            }
        }
        window.addEventListener('keypress', listener, false);
        return () => window.removeEventListener('keypress', listener, false);
    }, [editing, onSet, value]);
    return <div className="flex gap-5" onBlur={() => {
        onSet(value);
        setEditing(false);
    }}>
        {editing ? 
            <input type='text' className={className + ' p-2 border-[#01487C] border-[3px]'} value={value} onChange={(ev) => setValue(ev.target.value)} ref={ref}/>
        :
            <p className={className}>{value}</p>
        }
        {editable ?
            <img src={pen} alt={`Редактировать ${name}`} className="w-7 h-7 cursor-pointer" onClick={() => {
            if(editable) {
                setEditing(true)
            }
        }}/>
        : null
        }
    </div>
}