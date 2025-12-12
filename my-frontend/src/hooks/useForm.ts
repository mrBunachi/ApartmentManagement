import { useState } from "react";

export default function useForm(initial) {
    const [data, setData] = useState(initial);
    const set = (key: string, value: any) => setData({ ...data, [key]: value });
    return { data, set };
}