import { useEffect, useState } from "react";
import api from "../../api";

const useCallAPI = (endPoint) => {
    const [data, setData] = useState([]);

    useEffect(() => {
        let cancelled = false;
        api.get(`/${endPoint}`)
            .then((res) => {
                if (!cancelled) setData(res.data);
            })
            .catch((err) => console.error(err));
        return () => {
            cancelled = true;
        };
    }, [endPoint]);

    return data;
};

export const useFetch = (endPoint) => {
    const [state, setState] = useState({ data: [], loading: true });

    useEffect(() => {
        let cancelled = false;
        api.get(`/${endPoint}`)
            .then((res) => {
                if (!cancelled) setState({ data: res.data, loading: false });
            })
            .catch((err) => {
                console.error(err);
                if (!cancelled) setState((s) => ({ ...s, loading: false }));
            });
        return () => {
            cancelled = true;
        };
    }, [endPoint]);

    return state;
};

export default useCallAPI;
