import BottomUI from "../../components/BottomUI"
import FieldBackground from "../../components/FieldBackground"
import PlayField from "../../components/PlayField"

const PlayPage = () => {

    return (
        <>
            <section className="relative h-[54vh]">
                <FieldBackground />

                <PlayField />

            </section>
            <BottomUI />
        </>
    )
}

export default PlayPage
