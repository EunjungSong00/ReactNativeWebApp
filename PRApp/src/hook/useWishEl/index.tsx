import { TouchableOpacity } from "react-native-gesture-handler";
import Wrapper from '../../component/atom/Wrapper';
import React, {useCallback,ReactText, useState, useEffect} from 'react';
import useDomReady from '../useDomReady';
import Img from '../../component/atom/Img';
import actionWishApi from '../../api/mypage/actionWishApi';
import deleteWishApi from "../../api/mypage/deleteWishApi";
import { StackNavigationProp } from "react-navigation-stack/src/vendor/types";

// wish ,  element, initialValue
interface IWishEl {
    id: ReactText;
    initialValue: boolean;
    type?: 'small' | 'medium';
}

const useWishEl = ({id, initialValue, type= 'small'} : IWishEl, navigation:StackNavigationProp) => {
    const _id = Number(id)
    const [isWish, setIsWish] = useState<boolean>(initialValue);
    const domReady = useDomReady();

    //  wish 아이디 유무에 따라 actionWish && deleteWish 태우기
    useEffect(() => {
        if(domReady) {
            isWish ?
            // 아이디가 있는지 전달 할 곳 정하기
                actionWishApi(_id, 'CAR', navigation).then((response) => { // 아이디 있을때 wishActionApi
                    console.log('actionWishApi res:', id,response)
                })

            :
            deleteWishApi(_id, navigation).then((response) => { // 아이디 없을때 deleteActionApi <= 주의!!!
                console.log('deleteWishApi res:', id,response)
            })

        }
    }, [isWish])

    // 위시 마크 엘리먼트 스타일 (value 값) -> Element
    const Element = useCallback(() => {
        return(
            <TouchableOpacity onPress={() => setIsWish(prevState=>!prevState)}>
                <Wrapper>
                   <Img src={
                        isWish
                        ? require('../../../public/image/component/icon-liked-on.png')
                        : require('../../../public/image/component/icon-liked-off.png')}
                        width={type === 'small' ? 15 : 22 } height={ type === 'small' ? 15 :22}
                    />
                </Wrapper>
            </TouchableOpacity>
        )
    }, [isWish]);

    return {Element, isWish, setIsWish};
}

export default useWishEl;
