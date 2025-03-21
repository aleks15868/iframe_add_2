const background = document.querySelector('.modal');
const background_slider = document.querySelector('.modal_slider_window');
let button = document.querySelector('.modal_close');
let json_element_buildify;

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Add event listener for clicking the apartment listing
document.querySelector('.apartment_listing').addEventListener('click', async function (event) {
    const clickedElement = event.target.closest('.apartment_listing_item');
    button = document.querySelector('.modal_close');
    if (clickedElement) {
        const dataIndex = clickedElement.getAttribute('data-index');
        json_element_buildify = JSON.parse(localStorage.getItem('buildify_n'+(active_cout_page-1))).results;
        await replacing_information_in_a_modal(json_element_buildify[dataIndex]);
        background.style.display = "flex";
        await delay(100);
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
        background.style.opacity = "1";
        let modal_property_features = await features_parser(json_element_buildify[dataIndex]["objectID"]);
        document.querySelector(".modal_body .modal_details").innerHTML=modal_property_features;
    }
});
background.addEventListener('click', async function (event) {
    const button = event.target.closest('.modal_close');
    const Open_slider = event.target.closest('.modal_img_hover');
    if (button || event.target === background) {
        background.style.opacity = "0";
        await delay(500);
        background.style.display = "none";
    }
    if (Open_slider) {     
        background_slider.style.display = "flex";
        jQuery(document).ready(function($) {
            $('.slider_main').slick('setPosition');
            $('.slider_thumbnails .slick-current').addClass('slick-center-custom');
            $('.slider_thumbnails').slick('setPosition');
       });
        await delay(100);
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
        background_slider.style.opacity = "1";
    }
});

background_slider.addEventListener('click', async function (event) {
    const button_slider = event.target.closest('.modal_close_slider_window');
    if (button_slider || event.target === background_slider) {
        background_slider.style.opacity = "0";
        await delay(500);
        background_slider.style.display = "none";
    }
});
async function features_parser(object){
    let array_json={
        "architects":["/static/image/icon_architects.svg","Architects"],
        "builders":["/static/image/icon_builder.svg","Builder"],
        "interiorDesigners":["/static/image/icon_interior_designer.svg","Interior Designer"],
        "marketingCompanies":["/static/image/icon_marketers.svg","Marketers"],
        "salesCompanies":["/static/image/icon_sales.svg","Sales Company"] 
        }
    let json_conf=`&api_version=${api_version}&api_province=${api_province}&api_key=${api_key}`;
    const response = await fetch(`/api/modal_features_data?object=${object}${json_conf}`);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json();
    let result_features="";
    Object.keys(array_json).forEach(key => {
        data[key].forEach(item =>{
            result_features+=`<div>
                    <div class="modal_title"><span><img src="${array_json[key][0]}"></span>${array_json[key][1]}</div>  
                    <div class="modal_content">${item["name"] || "TBD"}</div>  
                </div>`;
        });
    });
    if (result_features != ""){
        result_features=`<div class="modal_list">${result_features}</div>`
    }
    return result_features;
}
async function replacing_information_in_a_modal(array_json){
if(array_json["photos"].length !== 0 ){
    jQuery(document).ready(function($) {
        $('.slider_main').slick('slickRemove', 0, null, true);
        $('.slider_thumbnails').slick('slickRemove', 0, null, true);
        if(array_json["photos"].length <=6 ){
            for (let index = 0; index < Math.ceil(6/array_json["photos"].length); index++) {
                array_json["photos"].forEach(image => {
                    $('.slider_main').slick('slickAdd', `<div class="slider_main_item"><img src="${image["url"]}"></div>`);
                    $('.slider_thumbnails').slick('slickAdd', `<div class="slider_thumbnails_item"><img src="${image["url"]}"></div>`);
                });
            }
        }
        else{
                array_json["photos"].forEach(image => {
                    $('.slider_main').slick('slickAdd', `<div class="slider_main_item"><img src="${image["url"]}"></div>`);
                    $('.slider_thumbnails').slick('slickAdd', `<div class="slider_thumbnails_item"><img src="${image["url"]}"></div>`);
                });
        }
    });
}
    array_key=["startPrice",
        "numberOfUnits",
        "averagePricePerSqFeet",
        "sellingStatus",
        "endPricePerSqFeet",
        "startPricePerSqFeet",
        "minSize",
        "maxSize",
        "salesStarted",
        "numberOfFloorPlans",
        "completionDate",
        "minBeds","maxBeds",
        "minBaths","maxBaths",
        "parkingCost",
        "parkingMaintainance",
        "lockerMaintainance",
        "ccOrMaintFee",
        "fullAddress",
        "constructionStatus",
        "totalDeposit",
        "estimatedCompletionDate"

    ];
    array_replease_json={};
    let image_json = "";
    let replase = "TBD";
    for (let index = 0; index < array_key.length; index++) {
        array_replease_json[array_key[index]]=array_json[array_key[index]] || replase;
    }
    for (let index = 0; index < array_key.length; index++) {
        array_replease_json[array_key[index]]=array_replease_json[array_key[index]].toLocaleString('en-US');
    }
    array_json["type"] = array_json["type"].join(",") || replase;
    
    range_price_json = array_replease_json["minSize"]+"-"+array_replease_json["maxSize"];
    range_price_json !== replase+"-"+replase ? range_price_json : replase
    for (let index = 0; index < Math.min(array_json["photos"].length,6); index++) {
        if(index ==  Math.min(array_json["photos"].length,6)-1){
            image_json+=`<div class="modal_img_item">
                                <img src="${array_json["photos"][index]["url"]}">
                                <div class="modal_img_hover">See all photos</div>
                            </div>`;  
        }
        else{
          image_json+=`<div class="modal_img_item">
                                <img src="${array_json["photos"][index]["url"]}">
                            </div>`;  
        }
    }
    if (window.innerWidth <= 768){
        if((Math.min(array_json["photos"].length,6)<=2) && ((Math.min(array_json["photos"].length,6)>=1))){
            for (let index = 0; index < 2-Math.min(array_json["photos"].length,6); index++) {
                image_json+=`<div class="modal_img_item">
                                </div>`;  
            }
        }
    }
    else{
        if((Math.min(array_json["photos"].length,6)<=3) && ((Math.min(array_json["photos"].length,6)>=1))){
            for (let index = 0; index < 3-Math.min(array_json["photos"].length,6); index++) {
                image_json+=`<div class="modal_img_item">
                                </div>`;  
            }
        }
    }
    let modal_galery = ``;
    if(array_json["photos"].length !== 0 ){
    modal_galery = `
    <div class="modal_image_gallery">
                        <h2>Image gallery</h2>
                        <div class="modal_img_list">
                            ${image_json}
                        </div>
                    </div>
    `;
    }
    let modal_amenities = "";
    if(array_json["amenities"].length !== 0 ){
        let amenities_list = "";
        array_json["amenities"].forEach(item => {
            amenities_list+=`
             <div>
                <div class="modal_title"><span><img src="/static/image/icon_check.svg"></span>${item}</div>  
            </div> 
        `;
        });
        modal_amenities=`
        <div class="modal_amenities">
            <h3>Amenities</h3>
            <div class="modal_list">
                ${amenities_list}
            </div>
        </div>`;
    }
    let deposit_structure="";
    let deposit_amount="";
    let item_deposit_amount=[];
    let item_deposit=[];
    let deposit_structure_array = [];
    array_json["paymentStructures"].forEach(item => {
        item["milestones"].forEach(string => {
            deposit_structure_array.push(`${string["text"]}`);
        });
        item_deposit.push(deposit_structure_array.join("</br>"));
        deposit_structure_array=[]
        item_deposit_amount.push(`• ${item["type"]}: ${item["totalDeposit"] || "TBD"}`);
    });
    deposit_structure=item_deposit.join("</br></br>");
    deposit_amount=item_deposit_amount.join("</br>");
    let sellingStatus="";
    switch (array_replease_json["sellingStatus"]) {
        case "Selling Now":
            sellingStatus="Selling";
            break;
        case "Registration":
            sellingStatus="Registration";
            break;
        default:
            sellingStatus=array_replease_json["sellingStatus"];
      }
    if(deposit_structure!==""){
        deposit_structure=`<div>
                                <div class="modal_title"><span><img src="static/image/icon_deposit_structure.svg"></span>Deposit Structure</div>
                                <div class="modal_content">${deposit_structure}</div>
                            </div>`;
    }
    if(deposit_amount!==""){
        deposit_amount=`<div>
                            <div class="modal_title"><span><img src="static/image/icon_deposit_amount.svg"></span>Deposit Amount</div>
                            <div class="modal_content">${deposit_amount}</div>
                        </div>`;
    }
    let modal = `
        <div class="modal_image">
                <img src="${array_json["coverPhoto"]["url"]}" alt="house">
            </div>
            <div class="modal_close"><img src="static/image/close.svg"></div>
            <div class="modal_info">
                <div class="selling_status_modal">${sellingStatus}</div>
                <div class="modal_characteristic">
                    <div class="modal_name">${array_json["name"]}</div>
                    <div class="modal_price">From<span>$${array_replease_json["startPrice"]}</span></div>
                    <div class="modal_line"></div>
                    <div class="modal_highlights">
                        <div>${array_json["type"]}</div>
                        <div>${array_replease_json["constructionStatus"]}</div>
                        <div>${array_replease_json["numberOfUnits"]} Units</div>
                        <div>Property ID:<span>${array_json["objectID"]}</span></div>
                        <div>${range_price_json} sqft</div>
                        <div>$${array_replease_json["averagePricePerSqFeet"]}/sqft</div>
                    </div>
                </div>
                <div class="modal_additional_information">
                    <div class="modal_description">
                        <h2>Description</h2>
                        <p>${array_json["summary"]}</p>
                    </div>
                    ${modal_galery}
                    <div class="modal_property_features">
                        <h2>Property features</h2>
                        <!--
                        <p>Lorem ipsum dolor sit amet, homero debitis temporibus in mei, at sit voluptua antiopam hendrerit. Lorem epicuri eu per. Mediocrem torquatos deseruisse te eum commodo.</p>
                        -->
                        <div class="modal_details">
                        <div class="modal_loader_body">
                            <div class="iframe_loader">
                                <span class="iframe_bar"></span>
                                <span class="iframe_bar"></span>
                                <span class="iframe_bar"></span>
                            </div>
                        </div>
                
                        </div>
                        ${modal_amenities}
                        <div class="modal_property_details">
                            <h3>Property details</h3>
                            <div class="modal_list">
                                <div class="modal_property_details_column1">
                                    <div class="modal_title"><span><img src="/static/image/icon_sq.svg"></span>Size:</div>
                                    <div class="modal_content">${array_replease_json["minSize"]} - ${array_replease_json["maxSize"]} SQFT</div>  
                                </div> 
                                <div class="modal_property_details_column2">
                                    <div class="modal_title"><span><img src="/static/image/icon_selling_status.svg"></span>Selling Status</div>
                                    <div class="modal_content">${array_replease_json["sellingStatus"]}</div>   
                                </div> 
                                <div class="modal_property_details_column2">
                                    <div class="modal_title"><span><img src="/static/image/icon_sases_started_date.svg"></span>Estimated Finish Date</div>
                                    <div class="modal_content">${array_replease_json["estimatedCompletionDate"]}</div>   
                                </div> 
                                <div class="modal_property_details_column2">
                                    <div class="modal_title"><span><img src="/static/image/icon_completation_date.svg"></span>Completition Date</div>
                                    <div class="modal_content">${array_replease_json["completionDate"]}</div>   
                                </div> 
                                <div class="modal_property_details_column1 modal_property_details_row2">
                                    <div class="modal_title"><span><img src="/static/image/icon_number_of_floors.svg"></span>Number of Floors</div>
                                    <div class="modal_content">${array_replease_json["numberOfFloorPlans"]}</div>   
                                </div> 
                                <div class="modal_property_details_column1 modal_property_details_row3">
                                    <div class="modal_title"><span><img src="/static/image/icon_bedroom.svg"></span>Bedrooms:</div>
                                    <div class="modal_content">${array_replease_json["minBeds"]}-${array_replease_json["maxBeds"]}</div>   
                                </div> 
                                <div class="modal_property_details_column1 modal_property_details_row4">
                                    <div class="modal_title"><span><img src="/static/image/icon_bathroom.svg"></span>Bathrooms:</div>
                                    <div class="modal_content">${array_replease_json["minBaths"]}-${array_replease_json["maxBaths"]}</div>   
                                </div> 
                            </div>
                        </div>
                        <div class="modal_pricing">
                            <h3>Pricing  &  deposit structure</h3>
                            <div class="modal_pricing_body">
                                <div class="modal_pricing_one">
                                    <div>
                                        <div class="modal_title"><span><img src="/static/image/icon_parking_cost.svg"></span>Parking cost</div>
                                        <div class="modal_content">$${array_replease_json["parkingCost"]}</div>  
                                    </div> 
                                    <div>
                                        <div class="modal_title"><span><img src="/static/image/icon_parking_maintenance.svg"></span>Parking Maintenance</div>
                                        <div class="modal_content">$${array_replease_json["parkingMaintainance"]}</div>  
                                    </div> 
                                    <div>
                                        <div class="modal_title"><span><img src="/static/image/icon_locker_maintenance.svg"></span>Locker Maintenance</div>
                                        <div class="modal_content">$${array_replease_json["lockerMaintainance"]}</div>  
                                    </div> 
                                    <div>
                                        <div class="modal_title"><span><img src="/static/image/icon_maintenance_dee.svg"></span>Maintenance Fee (sqft/M)</div>
                                        <div class="modal_content">$${array_replease_json["ccOrMaintFee"]}</div>  
                                    </div> 
                                </div>
                                <div class="modal_pricing_two">
                                    ${deposit_amount}
                                    ${deposit_structure}
                                </div>
                            </div> 
                        </div>
                        <div class="modal_location">
                            <h2>Location</h2>
                            <div class="modal_address">${array_replease_json["fullAddress"]}</div>
                            <iframe
                                src="https://www.google.com/maps?q=${array_json["_geoloc"]["lat"]},${array_json["_geoloc"]["lng"]}&output=embed"
                                class="modal_map" style="border:0;" allowfullscreen="" loading="lazy">
                            </iframe>
                        </iframe>
                         <div class="policy">
                            <div><a href="https://www.getbuildify.com/"><img src="/static/image/Buildify_logo.svg"></a></div>
                            <p>DISCLAIMER</br>Buildify’s database is managed by our data team in collaboration with our network of real estate developers and brokers. While we strive for accuracy, the content on our site is for reference only, and we are not liable for its use or misuse. Prices, sizes, specifications, and promotions are subject to change by the builder without notice. Please contact the developer's sales representatives for the latest information.</p>
                        </div>
                        </div>
                    </div>
               </div>
            </div>
    `;
    // class="modal_map"
    document.querySelector('.modal_body').innerHTML=modal;
}