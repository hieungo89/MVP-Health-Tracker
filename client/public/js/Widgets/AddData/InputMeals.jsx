import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Food from './Food.jsx';

const InputMeals = ({ handleReturnBtn, username }) => {
  const [mealType, setMealType] = useState();
  const [ingredientData, setIngredientData] = useState();
  const [foodData, setFoodData] = useState([]);

  // SEARCH FOR NUTRITION INFO FROM API
  const searchNutritionInfo = (e) => {
    e.preventDefault();
    const query = `${e.target.amount.value} ${e.target.measurement.value} of ${e.target.foodName.value}`;

    axios.get('http://localhost:3000/nutritionData', { params: { ingr: query } })
      .then(result => setIngredientData(result.data))
      .catch(err => console.log('~~ ERROR RETRIEVING NUTRITION DATA ~~', err));
  };

  // ADD INGREDIENTS TO FOOD DATA
  const handleAddIngredient = () => {
    setFoodData([...foodData, ingredientData]);
  };

  // REMOVE INGREDIENTS FROM FOOD DATA
  const handleRemoveIngredient = (food) => {
    let container = [];
    for (let i = 0; i < foodData.length; i++) {
      if (foodData[i].searchString !== food.searchString) { container.push(foodData[i]); }
    }
    setFoodData(container);
  };

  // SUBMIT MEAL DATA & POST TO DB
  const HandleAddMeal = (e) => {
    e.preventDefault()
    let data = {
      username: username,
      date: e.target.date.value,
      mealType: mealType,
      foodsEaten: undefined,
      nutrientCount: {
        calories: { quantity: 0, unit: undefined },
        fat: { quantity: 0, unit: undefined },
        carbohydrate: { quantity: 0, unit: undefined },
        fiber: { quantity: 0, unit: undefined },
        sugar: { quantity: 0, unit: undefined },
        protein: { quantity: 0, unit: undefined },
        cholesterol: { quantity: 0, unit: undefined },
        sodium: { quantity: 0, unit: undefined },
      }
    };

    for (let i = 0; i < foodData.length; i++) {
      if (!data.foodsEaten) {
        data.foodsEaten = foodData[i].searchString;
      } else {
        data.foodsEaten = data.foodsEaten + ', ' + foodData[i].searchString;
      }
      data.nutrientCount.calories.quantity += foodData[i].calories.quantity;
      data.nutrientCount.fat.quantity += foodData[i].fat.quantity;
      data.nutrientCount.carbohydrate.quantity += foodData[i].carbohydrate.quantity;
      data.nutrientCount.fiber.quantity += foodData[i].fiber.quantity;
      data.nutrientCount.sugar.quantity += foodData[i].sugar.quantity;
      data.nutrientCount.cholesterol.quantity += foodData[i].cholesterol.quantity;
      data.nutrientCount.sodium.quantity += foodData[i].sodium.quantity;
      if (data.nutrientCount.calories.unit === undefined) {
        data.nutrientCount.calories.unit = foodData[i].calories.unit;
        data.nutrientCount.fat.unit = foodData[i].fat.unit;
        data.nutrientCount.carbohydrate.unit = foodData[i].carbohydrate.unit;
        data.nutrientCount.fiber.unit = foodData[i].fiber.unit;
        data.nutrientCount.sugar.unit = foodData[i].sugar.unit;
        data.nutrientCount.protein.unit = foodData[i].protein.unit;
        data.nutrientCount.cholesterol.unit = foodData[i].cholesterol.unit;
        data.nutrientCount.sodium.unit = foodData[i].sodium.unit;
      }
    }

    console.log('DATA~~~~ ', data);
    axios.post('http://localhost:3000/userMeal', data)
      .then(() => handleReturnBtn())
      .catch(err => console.log('~~ ERROR ADDING MEAL TO DB ~~', err));
  }


  // LOGGING CHANGES FOR DEV
  useEffect(() => {
    console.log('ingredients: ', ingredientData);
  }, [ingredientData]);

  useEffect(() => {
    console.log('mealType: ', mealType);
  }, [mealType]);

  useEffect(() => {
    console.log('Food Data: ', foodData);
  }, [foodData]);


  return (
    <div>
      <br />
      <h4>
        You must complete the following in order to record your meal:
      </h4>
        <li>Select Date</li>
        <li>Choose a meal type</li>
        <li>Search and add foods that you've eaten</li>
        Click "ADD MEAL" to input your data.

      <form onSubmit={(e) => HandleAddMeal(e)}>
        <br />
        <input type="submit" value="ADD MEAL" /> &nbsp;
        <button onClick={() => handleReturnBtn()}>RETURN</button>
        <br /><br />
        <label>Select Date: </label> &nbsp;
        <input type="date" name="date" required />
        <br /><br />
        <label>Meal Type:</label> &nbsp;
        <select value={mealType} onChange={(e) => setMealType(e.target.value)} required>
          <option hidden>--</option>
          <option value="Breakfast">Breakfast</option>
          <option value="Brunch">Brunch</option>
          <option value="Lunch">Lunch</option>
          <option value="Dinner">Dinner</option>
          <option value="Snack">Snack</option>
          <option value="TeaTime">TeaTime</option>
          <option value="Other">Other</option>
        </select>
        <label><em>*Warning: choosing the same Meal Type for the same date will override your previous data.</em></label>
        <br /><br />

      </form>

      Food Added: {!foodData.length && 0}
      <br />
      {foodData.map(food => { return <Food food={food} key={food._id} handleRemove={handleRemoveIngredient} /> })}
      <br /><br />

      <form onSubmit={(e) => searchNutritionInfo(e)}>
        <label>Add Description:</label> <br />
        <input type="number" name="amount" placeholder="1" min="0" max="100" required /> &nbsp;
        <input type="text" name="measurement" placeholder="cup" size="8" /> of &nbsp;
        <input type="text" name="foodName" placeholder="spaghetti" size="10" required /> &nbsp;
        <input type="submit" value="SEARCH" />
      </form>

      {ingredientData &&
        <div>
          <br />
          Based on your search of {ingredientData.searchString}:
          <ul>
            {ingredientData.calories && <li>Calories: {ingredientData.calories.quantity}{ingredientData.calories.unit}</li>}
            {ingredientData.fat && <li>Fat: {ingredientData.fat.quantity}{ingredientData.fat.unit}</li>}
            {ingredientData.carbohydrate && <li>Carbohydrate: {ingredientData.carbohydrate.quantity}{ingredientData.carbohydrate.unit}</li>}
            {ingredientData.protein && <li>Protein: {ingredientData.protein.quantity}{ingredientData.protein.unit}</li>}
            {ingredientData.cholesterol && <li>Cholesterol: {ingredientData.cholesterol.quantity}{ingredientData.cholesterol.unit}</li>}
            {ingredientData.fiber && <li>Fiber: {ingredientData.fiber.quantity}{ingredientData.fiber.unit}</li>}
            {ingredientData.sodium && <li>Sodium: {ingredientData.sodium.quantity}{ingredientData.sodium.unit}</li>}
            {ingredientData.sugar && <li>Sugar: {ingredientData.sugar.quantity}{ingredientData.sugar.unit}</li>}
          </ul>
          <button onClick={() => handleAddIngredient()}>ADD</button>
        </div>
      }

    </div>
  );
};

export default InputMeals;
