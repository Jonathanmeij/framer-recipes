import { useState } from "react";

interface Mail {
    from: string;
    subject: string;
    body: string;
    date: string;
}

const fakeMails: Mail[] = [
    {
        from: "John Doe",
        subject: "Meeting at 3pm",
        body: "Hey, I wanted to remind you about the meeting at 3pm today. Don't forget to bring the documents.",
        date: "2021-08-20",
    },
    {
        from: "Jane Doe",
        subject: "Re: Meeting at 3pm",
        body: "Sure, I will bring the documents. Do you need anything else?",
        date: "2021-08-20",
    },
    {
        from: "Kees van Dijk",
        subject: "New project",
        body: "Hey, I have a new project for you. Can we meet tomorrow to discuss it?",
        date: "2021-08-19",
    },
    {
        from: "Peter de Vries",
        subject: "Not coming to work",
        body: "Hey, I'm not feeling well today. I won't be coming to work.",
        date: "2021-08-19",
    },
    {
        from: "Gijs Jansen",
        subject: "New feature",
        body: "Hey, I have an idea for a new feature. Can we discuss it tomorrow?",
        date: "2021-08-18",
    },
];

export default function MailClient() {
    const [mails, setMails] = useState(fakeMails);
    const [currentMail, setCurrentMail] = useState<Mail | null>(null);

    function addRandomMail() {
        const randomMail = fakeMails[Math.floor(Math.random() * fakeMails.length)];
        setMails([...mails, randomMail]);
    }

    return (
        <div>
            <MailList
                mails={mails}
                setCurrentMail={setCurrentMail}
                addRandomMail={addRandomMail}
            />
            <MailView mail={currentMail || mails[0]} />
        </div>
    );
}

function MailList({
    mails,
    setCurrentMail,
    addRandomMail,
}: {
    mails: Mail[];
    setCurrentMail: (mail: Mail) => void;
    addRandomMail: () => void;
}) {
    return (
        <div>
            <MailListHeader addRandomMail={addRandomMail} />
            {mails.map((mail, index) => (
                <MailItem key={index} mail={mail} setCurrentMail={setCurrentMail} />
            ))}
        </div>
    );
}

function MailListHeader({ addRandomMail }: { addRandomMail: () => void }) {
    return (
        <div className="">
            <button onClick={addRandomMail}>Click</button>
        </div>
    );
}

function MailItem({
    mail,
    setCurrentMail,
}: {
    mail: Mail;
    setCurrentMail: (mail: Mail) => void;
}) {
    return (
        <div
            className="p-4 my-2 rounded-lg bg-zinc-800 border-zinc-800"
            onClick={() => setCurrentMail(mail)}
        >
            <div className="flex justify-between">
                <label className="font-semibold">{mail.from}</label>
                <label className="text-sm">{mail.date}</label>
            </div>
            <label className="font-semibold">{mail.subject}</label>
            <p className="text-sm">{mail.body}</p>
        </div>
    );
}

function MailView({ mail }: { mail: Mail }) {
    return (
        <div className="p-4 rounded-lg bg-zinc-800 border-zinc-800">
            <div className="flex justify-between">
                <label className="font-semibold">{mail.from}</label>
                <label className="text-sm">{mail.date}</label>
            </div>
            <label className="font-semibold">{mail.subject}</label>
            <p>{mail.body}</p>
        </div>
    );
}
