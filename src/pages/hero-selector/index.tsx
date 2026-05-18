import { Avatar, Input, List, NavBar, Selector } from "antd-mobile"
import axios from "axios";
import { useEffect, useMemo, useState } from "react"
import { useNavigate } from "react-router"
import type { Hero } from "../../types/hero"

type PlatformType = 'aqq' | 'awx' | 'iqq' | 'iwx'

// 获取所有英雄列表
async function getHeroList(): Promise<Hero[]> {
    try {
        const res = await axios.get('http://1.13.191.133:3000/api/herolist');
        return res.data as Hero[]; // 直接返回英雄数组
    } catch (err) {
        console.error('获取英雄列表失败', err);
        return [];
    }
}

export default () => {
    const navigate = useNavigate()
    const [type, setType] = useState<PlatformType[]>(['aqq'])
    const [heroList, setHeroList] = useState<Hero[]>([])
    const [value, setValue] = useState('')
    useEffect(() => {
        getHeroList().then((data) => setHeroList(data));
    }, [])

    const sortedHeroList = useMemo(() => {
        return [...heroList].sort((a, b) => a.cname.localeCompare(b.cname, 'zh-Hans-CN'))
    }, [heroList])

    const filteredHeroList = useMemo(() => {
        if (!value) return sortedHeroList
        return sortedHeroList.filter(hero => hero.cname.includes(value))
    }, [sortedHeroList, value])

    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
            <NavBar back={null} style={{ '--border-bottom': '1px #eee solid' }}>
                平台/英雄选择
            </NavBar>
            <div style={{ padding: '12px' }}>
                <Selector
                    value={type}
                    onChange={(v) => setType(v)}
                    columns={2}
                    options={[
                        { label: '安卓QQ', value: 'aqq' },
                        { label: '安卓微信', value: 'awx' },
                        { label: '苹果QQ', value: 'iqq' },
                        { label: '苹果微信', value: 'iwx' },
                    ]}
                />
            </div>
            <Input
                style={{ padding: '0 12px 4px 12px' }}
                placeholder='快速搜索英雄'
                value={value}
                onChange={val => {
                    setValue(val)
                }}
            />
            <div style={{ flex: 1, overflow: 'auto' }}>
                <List>
                    {filteredHeroList.map((hero) => (
                        <List.Item
                            key={hero.ename}
                            clickable
                            prefix={<Avatar src={
                                `https://game.gtimg.cn/images/yxzj/img201606/heroimg/${hero.ename}/${hero.ename}.jpg`
                            } style={{ '--size': '36px' }} />}
                            onClick={() => navigate(`/hero-score?hero=${encodeURIComponent(hero.cname)}&type=${encodeURIComponent(type[0] ?? 'aqq')}`)}
                        >
                            {hero.cname}
                        </List.Item>
                    ))}
                </List>
            </div>
        </div>
    )
}
