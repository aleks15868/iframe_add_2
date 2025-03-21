let data;

function iframe_delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}


// Функция для подгрузки и использования данных с сервера
async function fetchAndSavePage() {
    const api_version = "v1-lite";
    const api_key = "AIzaSyCioc6adlFpZSmVAlXKKcpLQjgbY-ciW40";

    try {
        const response = await fetch(`/api/new_homes_data?api_version=${api_version}&api_key=${api_key}`);
        if (!response.ok) {
            throw new Error('Ошибка сети: ответ не успешный');
        }

        data = await response.json();
         
        // Сохраняем данные в localStorage под ключом 'home'
        localStorage.setItem('home_new', JSON.stringify(data));

        return data; // Возвращаем данные
    } catch (error) {
        console.error('Произошла ошибка при выполнении запроса:', error);
    }
}

window.addEventListener('load', async (event) => {
    array_province=["on", "bc","ab"];
    for (let index = 0; index < array_province.length; index++) {
        let iframe_apartment_listing = document.querySelector(`.apartment_listing_region_new_home[data-province="${array_province[index]}"]`);
        await AnimationCheked(array_province[index],iframe_apartment_listing);
    }
});

async function animation(iframe_check, dispay){
    if(!iframe_check){
        dispay.style.opacity = "0";
        await iframe_delay(10); // Теперь можно использовать await
        dispay.style.display = "none";
    }
    else{
        dispay.style.display = "flex";
        await iframe_delay(100);
        dispay.style.opacity = "1";
        dispay.style.height = "100%";
    }
}


async function AnimationCheked(province, dispay){
    // Анимация включения
    iframe_background = dispay.querySelector('.iframe_loader_body');
    animation(true, iframe_background);
    let div_apartment_listing_item="";
    // Изменение содержимого
    dispay.innerHTML = `
            <div class="iframe_loader_body">
                <div class="iframe_loader">
                    <span class="iframe_bar"></span>
                    <span class="iframe_bar"></span>
                    <span class="iframe_bar"></span>
                </div>
                `+div_apartment_listing_item+`
            </div>
    `;
    // CheckChangingFilters();
    const json = await fetchAndSavePage();
    let count_index = 0;
    json[province].forEach(element => {
        try {
            switch (element["sellingStatus"]) {
                case "Selling Now":
                    element["sellingStatus"]="Selling";
                    break;
                case "Registration":
                    element["sellingStatus"]="Registration";
                    break;
                default:
                    element["sellingStatus"]=element["sellingStatus"];
              }
            let name = "";
            let streetName = "";
            name = element["name"] && element["name"].length > 22 ? element["name"].slice(0, 20) + "..." : element["name"] || "TBD";
            if (element["startPrice"] !== null && element["startPrice"] !== undefined) {
                element["startPrice"] = element["startPrice"].toLocaleString('en-US');
            } else {
                element["startPrice"] = "TBD"; // Если цена отсутствует, устанавливаем значение по умолчанию
            }
            let item = `<div class="apartment_listing_item" data-index="${count_index}" data-region="${province}">
                            <div class="apartment_image">
                                <div class="selling_status">${element["sellingStatus"] || 'TDB'}</div>
                                <img src="${element["coverPhoto"]?.url || 'static/image/default_image.jpg'}" alt="home">
                            </div>
                            <div class="apartament_name">${name}</div>
                            <div class="apartament_address">
                                <span><img src="static/image/icon_address.svg">${element["fullAddress"]}</span>
                            </div>
                            <div class="apartament_about_the_house">
                                <div class="apartament_price">From $${element["startPrice"] || "TBD"}</div>
                                <div class="apartament_characteristic">
                                    <div class="apartament_sq"><img src="static/image/icon_sq.svg"><span>${element["maxSize"] || "0"}m</span></div>
                                    <div class="apartament_bedroom"><img src="static/image/icon_bedroom.svg"><span>${element["maxBeds"] || "0"}</span></div>
                                    <div class="apartament_bathroom"><img src="static/image/icon_bathroom.svg"><span>${element["maxBaths"] || "0"}</span></div>
                                </div>
                            </div>
                        </div>`;
            div_apartment_listing_item += item;
            count_index++;
        } catch (error) {
            console.error(`Error processing element: ${error.message}`, element);
            // Если нужно продолжать, просто пропускаем текущий элемент.
        }
    });
 
        dispay.innerHTML = `
        <div class="iframe_loader_body">
            <div class="iframe_loader">
                <span class="iframe_bar"></span>
                <span class="iframe_bar"></span>
                <span class="iframe_bar"></span>
            </div>
        </div>
        `+div_apartment_listing_item+`
    `;
    iframe_background = dispay.querySelector('.iframe_loader_body');
    animation(false, iframe_background);
}