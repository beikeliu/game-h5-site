import { List, NavBar, NoticeBar } from "antd-mobile"
import { useLocation, useNavigate } from "react-router"
import { useEffect, useState } from "react"
import axios from "axios"

// 获取英雄最低战力
async function getHero(params: { hero: string, type: string }): Promise<any> {
    try {
        const res = await axios.get(`https://1302621915-385ka30978.ap-beijing.tencentscf.com/api/gethero?hero=${params.hero}&type=${params.type}`);
        return res.data;
    } catch (err) {
        console.error('获取英雄最低战力失败', err);
        return [];
    }
}

export default () => {
    const navigate = useNavigate()
    const location = useLocation()
    const params = new URLSearchParams(location.search)
    const heroName = params.get('hero') || ''
    const selectedType = params.get('type') || 'aqq'
    const [data, setData] = useState<any>()
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        if (!heroName) return
        setLoading(true)
        getHero({ hero: heroName, type: selectedType })
            .then((res) => {
                setLoading(false)
                setData(res.data);
            });
    }, [heroName, selectedType]);

    if (!heroName) {
        return (
            <>
                <NavBar onBack={() => navigate('/hero-selector')}>最低战力</NavBar>
                <NoticeBar content="未选择英雄，请返回选择页" color='error' />
            </>
        )
    }

    return (
        <>
            <NavBar onBack={() => navigate('/hero-selector')}>最低战力</NavBar>
            {loading ? null :
                <>
                    <NoticeBar content={`更新时间: ${data?.updatetime || '--'}`} color='success' />
                    <List header={heroName}>
                        <List.Item>大国: {data?.Top10 || '--'}</List.Item>
                        <List.Item>小国: {data?.Top100 || '--'}</List.Item>
                        <List.Item>省标: {data?.province?.[0]?.val || '--'} {data?.province?.[0]?.loc || '--'}</List.Item>
                        <List.Item>市标: {data?.city?.[0]?.val || '--'} {data?.city?.[0]?.loc || '--'}</List.Item>
                        <List.Item>区标: {data?.county?.[0]?.val || '--'} {data?.county?.[0]?.loc || '--'}</List.Item>
                    </List>
                </>
            }
        </>
    )
}
