import AppstoreCard from "@/components/AppstoreCard";
import ComponentCard from "@/components/componentCard";
import ConfirmButton from "@/components/confirmButton";
import Container from "@/components/container";
import IosAlarmPicker from "@/components/iosAlarmPicker";
import IosSlider from "@/components/IosSlider";

export default function Home() {
    return (
        <div className="w-screen min-h-screen">
            <Container className="space-y-2">
                <div className="p-6 md:p-0">
                    <h1 className="text-xl font-semibolds">Framer motion practise</h1>
                    <p className="font-light text-zinc-300">
                        Here I will display a couple of framer motion practise components.
                    </p>
                </div>

                <ComponentCard title="IOS slider">
                    <IosSlider />
                </ComponentCard>

                <ComponentCard title="Appstore card">
                    <AppstoreCard />
                </ComponentCard>

                <ComponentCard title="Confirm button">
                    <ConfirmButton />
                </ComponentCard>

                <ComponentCard title="IOS alarm picker">
                    <IosAlarmPicker />
                </ComponentCard>

                <div className="h-12"></div>

                {/* <ComponentCard title="Mail client">
                    <MailClient />
                </ComponentCard> */}
            </Container>
        </div>
    );
}
