// FILENAME: script.js
document.addEventListener('DOMContentLoaded', () => {

    // --- Přepínání mobilního menu (Potřebné na všech stránkách) ---
    const menuToggle = document.querySelector('.menu-toggle');
    const mainNav = document.querySelector('.main-nav');

    if (menuToggle && mainNav) {
        menuToggle.addEventListener('click', () => {
            mainNav.classList.toggle('active');
            const isActive = mainNav.classList.contains('active');
            menuToggle.setAttribute('aria-expanded', isActive);
            // Změna ikony hamburger/křížek
            const icon = menuToggle.querySelector('i');
            if (isActive) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times'); // Ikona křížku
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars'); // Ikona hamburgeru
            }
        });
    }

    // --- Aktuální rok v patičce (Potřebné na všech stránkách) ---
    const currentYearSpan = document.getElementById('currentYear');
    if (currentYearSpan) {
        const now = new Date();
        currentYearSpan.textContent = now.getFullYear();

        // Vložení aktuálního času a lokace, pokud ještě není
        if (currentYearSpan.parentNode && !currentYearSpan.parentNode.querySelector('.time-location')) {
            const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit' };
            const formattedDate = now.toLocaleDateString('cs-CZ', options);
            const location = "Olomouc, Olomoucký kraj, Česko";

            const timeLocationP = document.createElement('p');
            timeLocationP.classList.add('small-text', 'time-location');
            timeLocationP.textContent = `Aktuální čas (${location}): ${formattedDate}`;

            const disclaimerP = currentYearSpan.parentNode.querySelector('p.small-text'); // Najde první existující .small-text (což je disclaimer)
            if (disclaimerP) {
                // Vložit před disclaimer, pokud existuje
                currentYearSpan.parentNode.insertBefore(timeLocationP, disclaimerP);
            } else {
                // Jinak vložit za copyright (za <span id="currentYear"></span> a jeho textový uzel)
                 currentYearSpan.parentNode.insertBefore(timeLocationP, currentYearSpan.nextSibling.nextSibling);
            }
        }
    }


    // --- BMI Kalkulačka (Spustí se POUZE pokud jsou elementy na stránce - tj. na bmi.html) ---
    const calculateBtn = document.getElementById('calculateBtn');
    if (calculateBtn) {

        const heightInput = document.getElementById('height'); // Očekává metry, např. 1.75
        const weightInput = document.getElementById('weight');
        const resultsDiv = document.getElementById('results');
        const bmiValueSpan = document.getElementById('bmiValue');
        const bmiCategorySpan = document.getElementById('bmiCategory');
        const recommendationTextP = document.getElementById('recommendationText');
        const errorMessageP = document.getElementById('error-message');

        calculateBtn.addEventListener('click', () => {
            resultsDiv.style.display = 'none';
            errorMessageP.textContent = '';

            // Zpracování výšky s desetinnou čárkou nebo tečkou
            const heightStr = heightInput.value.replace(',', '.');
            const height = parseFloat(heightStr);

            const weightStr = weightInput.value.replace(',', '.');
            const weight = parseFloat(weightStr);

            if (isNaN(height) || height <= 0 || height > 3) { // Validace pro metry
                errorMessageP.textContent = 'Zadejte platnou výšku v metrech (např. 1,75).';
                heightInput.focus();
                return;
            }
            if (isNaN(weight) || weight <= 0 || weight > 500) {
                errorMessageP.textContent = 'Zadejte platnou váhu v kilogramech.';
                weightInput.focus();
                return;
            }

            const bmi = calculateBMI(weight, height);
            const bmiCategory = getBMICategory(bmi);
            const recommendation = getBMIRecommendation(bmiCategory);

            bmiValueSpan.textContent = bmi.toFixed(2);
            bmiCategorySpan.textContent = bmiCategory;
            recommendationTextP.textContent = recommendation;
            resultsDiv.style.display = 'block';
        });

        function calculateBMI(weight, height) {
            return weight / (height * height); // Výška v metrech
        }

        function getBMICategory(bmi) {
            if (bmi < 18.5) return 'Podváha';
            if (bmi < 24.9) return 'Normální váha';
            if (bmi < 29.9) return 'Nadváha';
            return 'Obezita';
        }

        function getBMIRecommendation(category) {
             switch (category) {
                case 'Podváha':
                    return 'Vaše BMI naznačuje podváhu. Doporučujeme konzultaci s lékařem nebo nutričním specialistou ohledně možného navýšení kalorického příjmu kvalitní stravou a vhodného cvičebního plánu pro nabírání hmoty (svalové i tukové, pokud je třeba). Zaměřte se na silový trénink.';
                case 'Normální váha':
                    return 'Vaše BMI je v normálním rozmezí. Skvělá práce! Udržujte zdravý životní styl s vyváženou stravou a pravidelným pohybem (kombinace kardia a silového tréninku).';
                case 'Nadváha':
                    return 'Vaše BMI naznačuje nadváhu. Zvažte úpravu stravovacích návyků (mírný kalorický deficit, více zeleniny, bílkovin) a zařazení pravidelné fyzické aktivity (kardio a silový trénink) pro zlepšení zdraví a snížení rizik spojených s nadváhou.';
                case 'Obezita':
                    return 'Vaše BMI spadá do kategorie obezity, což může představovat zdravotní rizika. Důrazně doporučujeme konzultaci s lékařem a případně nutričním specialistou a trenérem pro sestavení bezpečného a efektivního plánu na redukci hmotnosti a změnu životního stylu.';
                default:
                    return 'Nelze určit doporučení.';
            }
        }
    }


    // --- Kalkulačka Tréninku a Kalorií (Spustí se POUZE pokud jsou elementy na stránce - tj. na kalkulacka-trenink.html) ---
    const calculateTrainingBtn = document.getElementById('calculateTrainingBtn');
    if (calculateTrainingBtn) {
        const ageInput = document.getElementById('age');
        const genderSelect = document.getElementById('gender');
        const heightCalcInput = document.getElementById('heightCalc'); // Zde může být zadáno v m (1,75) nebo cm (175)
        const weightCalcInput = document.getElementById('weightCalc');
        const activityLevelSelect = document.getElementById('activityLevel');
        const goalSelect = document.getElementById('goal');
        const workoutPreferenceSelect = document.getElementById('workoutPreference');
        const trainingResultsDiv = document.getElementById('trainingResults');
        const tdeeValueSpan = document.getElementById('tdeeValue');
        const workoutRecommendationTextP = document.getElementById('workoutRecommendationText');
        const trainingErrorMessageP = document.getElementById('training-error-message');

        calculateTrainingBtn.addEventListener('click', () => {
            trainingResultsDiv.style.display = 'none';
            trainingErrorMessageP.textContent = '';

            const age = parseInt(ageInput.value);
            const gender = genderSelect.value;

            // Zpracování vstupu výšky (heightCalcInput)
            let heightInputStr = heightCalcInput.value.replace(',', '.'); // Nahradí čárku za tečku
            let heightForCalc = parseFloat(heightInputStr); // Zparsuje jako číslo

            // Převod na centimetry pro BMR vzorec, pokud byl vstup v metrech
            if (heightForCalc > 0 && heightForCalc < 10) { // Předpoklad: uživatel zadal metry (např. 1.75)
                heightForCalc = heightForCalc * 100; // Převod na cm
            }
            // Pokud uživatel zadal např. "175", heightForCalc zůstane 175 (cm)

            const weightStr = weightCalcInput.value.replace(',', '.');
            const weight = parseFloat(weightStr);
            
            const activityLevel = activityLevelSelect.value;
            const goal = goalSelect.value;
            const workoutPreference = workoutPreferenceSelect.value;

            let isValid = true;
            if (isNaN(age) || age <= 0 || age > 120) {
                trainingErrorMessageP.textContent += 'Zadejte platný věk (1-120). ';
                if(isValid) ageInput.focus();
                isValid = false;
            }
            
            // Validace výšky v CM (po případném převodu z metrů)
            if (isNaN(heightForCalc) || heightForCalc <= 50 || heightForCalc > 300) { 
                trainingErrorMessageP.textContent += 'Zadejte platnou výšku v cm (50-300) nebo v metrech (0.50-3.00), např. 175 nebo 1,75. ';
                if(isValid) heightCalcInput.focus();
                isValid = false;
            }
            
            if (isNaN(weight) || weight <= 10 || weight > 500) {
                trainingErrorMessageP.textContent += 'Zadejte platnou váhu v kg (10-500). ';
                if(isValid) weightCalcInput.focus();
                isValid = false;
            }
            
            if (!isValid) return;

            let bmr;
            if (gender === 'male') {
                bmr = (10 * weight) + (6.25 * heightForCalc) - (5 * age) + 5; // heightForCalc je zde již v cm
            } else { // female
                bmr = (10 * weight) + (6.25 * heightForCalc) - (5 * age) - 161; // heightForCalc je zde již v cm
            }

            let activityMultiplier;
            switch (activityLevel) {
                case 'sedentary': activityMultiplier = 1.2; break;
                case 'light': activityMultiplier = 1.375; break;
                case 'moderate': activityMultiplier = 1.55; break;
                case 'active': activityMultiplier = 1.725; break;
                case 'very_active': activityMultiplier = 1.9; break;
                default: activityMultiplier = 1.2;
            }
            let tdee = bmr * activityMultiplier;

            switch (goal) {
                case 'lose': tdee -= 500; break; 
                case 'gain': tdee += 400; break; 
            }
            tdee = Math.round(tdee);

            let workoutRec = "";
            if (goal === 'lose') {
                workoutRec += "Cíl: Redukce hmotnosti.\nPro hubnutí je klíčový kalorický deficit a pravidelný pohyb.\n\n";
                if (workoutPreference === 'cardio') {
                    workoutRec += "Doporučení: Zaměřte se na 3-5 kardio tréninků týdně. Kombinujte delší tréninky o nižší intenzitě (LISS, např. rychlá chůze, běh, kolo po dobu 45-60 min) s kratšími, intenzivnějšími intervalovými tréninky (HIIT, např. sprinty, 1-2x týdně po 20-25 min). Doplňkově můžete zařadit 1-2x týdně lehčí silový trénink pro udržení svalové hmoty.";
                } else if (workoutPreference === 'strength') {
                    workoutRec += "Doporučení: Zařaďte 2-3x týdně silový trénink celého těla nebo split (např. horní/dolní část těla). Silový trénink pomáhá udržet svalovou hmotu při hubnutí a zrychluje metabolismus. Doplňte 2-3x týdně kardio aktivitou (např. 20-40 min svižné chůze, běhu nebo jízdy na kole).";
                } else { // both
                    workoutRec += "Doporučení: Ideální je kombinace 2-3 silových tréninků a 2-3 kardio tréninků týdně. Silové tréninky mohou být zaměřeny na celé tělo nebo split. Kardio může být střídání LISS a HIIT. Tato kombinace efektivně spaluje tuky a buduje/udržuje svaly.";
                }
            } else if (goal === 'maintain') {
                workoutRec += "Cíl: Udržení kondice a váhy.\nPro udržení váhy je důležité vyvážit příjem a výdej energie.\n\n";
                if (workoutPreference === 'cardio') {
                    workoutRec += "Doporučení: Udržujte 3-4 kardio aktivity týdně, různé intenzity a délky (30-60 min). Můžete zařadit i 1-2x týdně lehčí silový trénink pro udržení svalové síly a prevenci zranění.";
                } else if (workoutPreference === 'strength') {
                    workoutRec += "Doporučení: Věnujte se 3-4x týdně silovému tréninku (můžete využít split jako Push/Pull/Legs nebo Upper/Lower). Doplňte lehkým kardiem (např. denní chůze, 1-2x týdně lehčí běh/kolo pro zdraví srdce).";
                } else { // both
                    workoutRec += "Doporučení: Kombinujte 2-3 silové tréninky s 2-3 kardio aktivitami týdně. Tento přístup zajistí komplexní rozvoj kondice, síly a vytrvalosti.";
                }
            } else { // gain
                workoutRec += "Cíl: Nabírání svalové hmoty.\nPro nabírání svalů je nezbytný mírný kalorický přebytek a progresivní silový trénink.\n\n";
                if (workoutPreference === 'cardio') {
                    workoutRec += "Doporučení: I při preferenci kardia je pro nabírání svalů klíčový silový trénink. Zařaďte alespoň 2-3x týdně intenzivní silový trénink celého těla nebo základních cviků. Kardio omezte na 1-2 lehčí sessiony týdně (20-30 min), aby nepálilo příliš mnoho kalorií potřebných pro růst.";
                } else if (workoutPreference === 'strength') {
                    workoutRec += "Doporučení: Zaměřte se na 3-5 silových tréninků týdně (např. Push/Pull/Legs, Upper/Lower split, nebo Full Body 3x týdně). Soustřeďte se na základní vícekloubové cviky a snažte se o progresivní přetížení (zvyšování vah, opakování). Kardio minimalizujte (max 1-2x týdně very lehce) nebo zařaďte jen krátké zahřátí/zklidnění.";
                } else { // both
                    workoutRec += "Doporučení: Ideální je 3-4x týdně silový trénink s důrazem na objem a progresi. Doplňte 1-2x týdně středně intenzivní kardio (20-30 min) pro podporu regenerace, kardiovaskulárního zdraví a pro zamezení nadměrného nabírání tuku.";
                }
            }
            workoutRec += "\n\nNezapomeňte na dostatečný odpočinek, kvalitní spánek a regeneraci mezi tréninky. Důležitá je konzistence a postupné navyšování zátěže (progrese). Technika cviků je vždy na prvním místě!";


            tdeeValueSpan.textContent = tdee;
            workoutRecommendationTextP.innerHTML = workoutRec.replace(/\n/g, '<br>');
            trainingResultsDiv.style.display = 'block';

            if (window.innerWidth < 768) {
                trainingResultsDiv.scrollIntoView({ behavior: 'smooth' });
            }
        });
    }

});