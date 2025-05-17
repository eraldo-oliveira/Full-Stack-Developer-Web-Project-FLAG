import { Route, Switch } from "wouter";
import Footer from "./components/Footer";
import Header from "./components/Header";
import HomePage from "./views/HomePage.jsx";
import DetailsPage from "./views/DetailsPage.jsx";
import RecipeListPage from "./views/RecipeListPage.jsx";
import LoginPage from "./views/LoginPage.jsx";
import EditRecipePage from "./views/EditRecipePage.jsx";
import CreateRecipePage from "./views/CreateRecipePage.jsx";

function App() {
  return (
    <>
      <div className="flex flex-col min-h-screen bg-gray-100">
        <Header />
          <Switch>
            <Route path="/" component={HomePage} />  
            <Route path="/details/:slug" component={DetailsPage} key={location} />
            <Route path="/receitas" component={RecipeListPage} />   
            <Route path="/login" component={LoginPage} />
            <Route path="/edit/:_id" component={EditRecipePage} />  
            <Route path="/nova-receita" component={CreateRecipePage} />  
          </Switch>
        <Footer />
      </div>  
    </>
  );
}

export default App;

