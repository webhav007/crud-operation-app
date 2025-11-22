interface Props {
    name: string;
}

export default function Avatar({ name }: Props) {
    const initials = name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase();

    return (
        <div
            className="w-8 h-8 rounded-full text-white flex items-center justify-center text-sm font-medium"
            style={{ backgroundColor: 'var(--avatar-bg)' }}
        >
            {initials}
        </div>
    );
}
