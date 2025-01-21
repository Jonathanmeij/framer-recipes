import ComponentCard from "./components/componentCard";
import Container from "./components/container";
import MailClient from "./components/mailClient";

function App() {
    return (
        <div className="w-screen min-h-screen p-6">
            <Container className="space-y-2">
                <h1 className="text-xl font-semibold">Framer motion practise</h1>
                <p className="font-light text-zinc-300">
                    Here I will display a couple of framer motion practise components.
                </p>
                <ComponentCard title="Mail client">
                    <MailClient />
                </ComponentCard>
            </Container>
        </div>
    );
}

export default App;
