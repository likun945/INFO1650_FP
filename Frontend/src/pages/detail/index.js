import React, { useState,useEffect } from 'react';
import './Detail-SASS/detail_main.css';
import useRequest from '../../hooks/useRequest';
import getFakeComment from "./fakeComment";
import getFakeAttraction from "./fakeAttraction";
import {Link, useLocation} from 'react-router-dom';
const fake_attraction=getFakeAttraction();
const fake_comment=getFakeComment();
const style = {
    '--bs-breadcrumb-divider': '>', // 直接设置 CSS 变量
};


const Detail = () => {
    //获取attraction id
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const id = queryParams.get('id');

    const { request: requestComments, isLoading: isLoadingComments, error: errorComments } = useRequest(`/comment?attraction_id=${id}`, { method: 'GET' });
    const { request: requestAttraction, isLoading: isLoadingAttraction, error: errorAttraction } = useRequest(`/attraction?id=${id}`, { method: 'GET' });

    const [Loading,setLoading]=useState(true);
    const [AttractionData, setAttractionData] = useState(null);
    const [CommentData,SetCommentData]=useState(null);
    const [commentNum,SetcommentNum]=useState(0);
    const [startIndex,SetstartIndex]=useState(0);
    const [Predisable,setPrevdisable]=useState(true);
    const [Nextdisable,setNextdisable]=useState(true);
    setTimeout(()=> {
        setLoading(false);
    }, 2000);

    useEffect(() => {
        const fetchData = async () => {
            const attrData = await requestAttraction();
            const commentData=await requestComments();
            if (!errorComments && !errorAttraction) {
                setAttractionData(attrData.data.attraction);
                SetCommentData(commentData.data.comments);
                SetcommentNum(commentData.data.comments.length);
                SetstartIndex(0);
                setPrevdisable(true);
                if (commentData.data.comments.length<=4){
                    setNextdisable(true);
                }
                else{
                    setNextdisable(false);
                }
            }
        };
        fetchData();
    }, []);
    //showdata
    useEffect(()=>{
        if (AttractionData) {
            console.log(AttractionData); // 这里将在 AttractionData 更新后执行
        }
    },[AttractionData])
    if (!AttractionData || ! CommentData) {
        return <div>Loading...</div>; // 在数据加载时显示加载指示
    }
    const generateIndicatorButton=()=>{
        const num=AttractionData.image.length;
        const divs = [];
        for (let i = 0; i < num; i++) {
            divs.push(
                <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to={i.toString()} className={i=== 0 ? 'active' : ''}
                        aria-current="true" aria-label={`Slide ${i + 1}`}></button>
            );
        }

        return divs;
    }
    const generateCarousItem=()=>{
        const num=AttractionData.image.length;
        const divs = [];
        for (let i = 0; i < num; i++) {
            divs.push(
                <div className={`carousel-item ${i === 0 ? 'active' : ''}`} >
                    <img src={AttractionData.image[i]} className="d-block w-100" alt="..."/>
                </div>
            );
        }
        return divs
    }
    const generateStar=(attraction)=>{
        const divs=[]
        const rate=attraction.rate;
        var rounded=Math.round(parseFloat(attraction.rating));
        for(let i=1;i<=5;i++){
            if (i<=rounded){
                divs.push(
                    <span data-value={i} className="active">★</span>
                )
            }
            else{
                divs.push(
                    <span data-value={i}>☆</span>
                )
            }
        }
        return divs;
    }
    const generateRateInfoList=()=>{
        const attraction=AttractionData
        const divs=[]
        divs.push(
            <li className="list-group-item d-flex justify-content-between align-items-center">
                <h1 style={{ fontWeight: 'bold' }} className="title">{attraction.name}</h1>
            </li>
        )
        divs.push(
            <li className="list-group-item d-flex justify-content-between align-items-center">
                <div className="detail_rating" style={{ fontSize: '35px' }}>
                    {generateStar(attraction)}
                </div>
                <div className="detail_score">
                    <h2><span className='detail_yellow_bold'>{attraction.rating}</span><span style={{ fontSize: '20px' }}>/5.0</span>
                    </h2>
                </div>
            </li>
        )
        divs.push(
            <li className="list-group-item d-flex justify-content-between align-items-center">
                <div className="detail_list_title">
                    <h6>Location</h6>
                </div>
                <div className="detail_list_content loc">
                    <h6>{attraction.location}</h6>
                </div>
            </li>
        )
        divs.push(
            <li className="list-group-item d-flex justify-content-between align-items-center">
                <div className="detail_list_title">
                    <h6>Open Time</h6>
                </div>
                <div className="detail_list_content time">
                    <h6>{attraction.opening_hours}</h6>
                </div>
            </li>
        )
        divs.push(
            <li className="list-group-item d-flex justify-content-between align-items-center">
                <div className="detail_list_title">
                    <h6>Official Tel.</h6>
                </div>
                <div className="detail_list_content tel">
                    <h6>{attraction.official_tel}</h6>
                </div>
            </li>
        )
        return divs;
    }
    const generateComment=()=>{
        return (
            Loading ? (
                <div className="spinner-border" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            ):(
                <div className="detail_comment_contents" >
                    {generateSingleComment()}
                </div>
            )
        )
    }
    const generateCommentStar=(rate)=>{
        const rounded=Math.round(rate);
        const divs=[]
        for(let i=1;i<=5;i++){
            if (i<=rounded){
                divs.push(
                    <span  style={{color: 'orange'}}
                          className="detail_comment_rate_star">★</span>
                )
            }
            else{
                divs.push(
                    <span className="detail_comment_rate_star">☆</span>
                )
            }
        }
        return divs;
    }
    const generateSingleComment=()=>{
        const divs=[];
        for(let i=startIndex;i<=startIndex+3;i++){
            if (i<commentNum){
                let comment=CommentData[i];
                divs.push(
                    <div className="detail_comments_item_container" >
                        <div className="detail_comment_c1">
                            <div className="detail_comment_icon">
                                <img
                                    src={comment.avatar}
                                    style={{ height: '80%', width: '80%', margin: '10%' }}
                                />
                            </div>
                            <div className="detail_comment_name" style={{marginLeft: '8%'}}>
                                {comment.reviewer_name}
                            </div>
                        </div>
                        <div className="detail_comment_c2">
                            <h4 className="detail_comment_title">{comment.review_title}</h4>
                            <div className="detail_comment_rate">
                                {generateCommentStar(comment.star_rating)}
                                <span className="detail_comment_rate_time"
                                      style={{marginLeft:'20px'}}>{comment.review_time}
                                </span>
                            </div>
                            <div className="detail_comment_text">
                                <p>
                                    {comment.detailed_review}
                                </p>
                            </div>
                        </div>
                    </div>
                )
            }
        }
        return divs
    }




    return (
        <div className="detail_body">
            <div className="detail_main_container">
                <div className="detail_breadcrumb_container">
                    <nav style={style} aria-label="breadcrumb">
                        <ol className="breadcrumb">
                            <li className="breadcrumb-item">
                                <Link to="/home">Home</Link>
                            </li>
                            <li className="breadcrumb-item active" aria-current="page">Library</li>
                        </ol>
                    </nav>
                </div>
                <div className="detail_pic_rate_container">
                    <div className="detail_carousel_container" id="attraction_vue">
                        <div id="carouselExampleIndicators" className="carousel slide">
                            <div className="carousel-indicators">
                                {generateIndicatorButton()}
                            </div>
                            <div className="carousel-inner">
                                {generateCarousItem()}
                            </div>
                            <button className="carousel-control-prev" type="button" data-bs-target="#carouselExampleIndicators"
                                data-bs-slide="prev">
                            <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                            <span className="visually-hidden">Previous</span>
                            </button>
                            <button className="carousel-control-next" type="button" data-bs-target="#carouselExampleIndicators"
                                data-bs-slide="next">
                            <span className="carousel-control-next-icon" aria-hidden="true"></span>
                            <span className="visually-hidden">Next</span>
                            </button>
                        </div>
                    </div>
                    <div className="detail_rate_info_container">
                        <ul className="list-group">
                            {generateRateInfoList()}
                        </ul>

                    </div>
                </div>
                <div className="detail_intro_container">
                    <div className="detail_intro_content2">
                        <div className="accordion" id="accordionPanelsStayOpenExample">
                            <div className="accordion-item">
                                <h2 className="accordion-header">
                                    <button className="accordion-button" type="button" data-bs-toggle="collapse"
                                            data-bs-target="#panelsStayOpen-collapseOne" aria-expanded="true"
                                            aria-controls="panelsStayOpen-collapseOne">
                                        Introduction
                                    </button>
                                </h2>
                                <div id="panelsStayOpen-collapseOne" className="accordion-collapse collapse show">
                                    <div className="accordion-body intro">
                                        {AttractionData.detailed_description}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="detail_intro_content">
                        <div className="accordion" id="accordionPanelsStayOpenExample2">
                            <div className="accordion-item">
                                <h2 className="accordion-header">
                                    <button className="accordion-button" type="button" data-bs-toggle="collapse"
                                            data-bs-target="#panelsStayOpen-collapseTwo" aria-expanded="true"
                                            aria-controls="panelsStayOpen-collapseTwo">
                                        Open Time
                                    </button>
                                </h2>
                                <div id="panelsStayOpen-collapseTwo" className="accordion-collapse collapse show">
                                    <div className="accordion-body time">
                                        {AttractionData.opening_hours}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="detail_intro_content">
                        <div className="accordion" id="accordionPanelsStayOpenExample3">
                            <div className="accordion-item">
                                <h2 className="accordion-header">
                                    <button className="accordion-button" type="button" data-bs-toggle="collapse"
                                            data-bs-target="#panelsStayOpen-collapseThree" aria-expanded="true"
                                            aria-controls="panelsStayOpen-collapseThree">
                                        Tips
                                    </button>
                                </h2>
                                <div id="panelsStayOpen-collapseThree" className="accordion-collapse collapse show">
                                    <div className="accordion-body tips">
                                        {AttractionData.tips}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="detail_comment_container" id="comments">
                    <div className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel"
                         aria-hidden="true">
                        <div className="modal-dialog">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h1 className="modal-title fs-5" id="exampleModalLabel">Submit Comment</h1>
                                    <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                </div>
                                <div className="modal-body">
                                    Are you sure you want to submit this comment? Once submitted, you may not be able to edit or delete it.
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                                    <button type="button" className="btn btn-primary" data-bs-dismiss="modal" >Confirm</button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="detail_comment_head">Comments</div>
                    {generateComment()}
                </div>
            </div>
        </div>
    );
};

export default Detail;