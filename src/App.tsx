import { Routes, Route } from "react-router-dom";
import AppstoreCard from "./components/AppstoreCard";
import IosSlider from "./components/IosSlider";
import Home from "./pages/home";

function App() {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route
                path="/Appstore card"
                element={
                    <PageWrapper>
                        <AppstoreCard />
                    </PageWrapper>
                }
            />

            <Route
                path="/ios slider"
                element={
                    <PageWrapper>
                        <IosSlider />
                    </PageWrapper>
                }
            />
        </Routes>
    );
}

function PageWrapper({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex items-center justify-center w-screen min-h-screen">
            {children}
        </div>
    );
}

export default App;
