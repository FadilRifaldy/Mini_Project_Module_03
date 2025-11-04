import EventDetail from "@/components/EventDetail";

export default function EventPage({ params }: { params: { id: string } }) {
  return <EventDetail id={params.id} />;
}
