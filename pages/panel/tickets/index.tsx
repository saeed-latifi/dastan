import TicketPanelCard from "@components/cards/ticket-panel-card";
import ButtonBase from "@components/common/base-button";
import FormSection from "@components/forms/form-section";
import LoadingSpinner from "@components/icons/LoadingSpinner";
import ModalCreateTickets from "@components/modals/tickets/modal-create-tickets";
import Navigation from "@components/navigation";
import { usePanelTickets } from "@hooks/panel/usePanelTickets";
import { ModalContext } from "@providers/contexts/ModalContext";
import { useContext } from "react";
import InfiniteScroll from "react-infinite-scroller";
import { staticURLs } from "statics/url";

export default function TicketPage() {
	const { isLoading, isValidating, ticketsInfo, getMore, hasMore } = usePanelTickets();

	const { onCloseModal, setModal } = useContext(ModalContext);

	function onCrateTicketModal() {
		setModal(<ModalCreateTickets onCloseModal={onCloseModal} />);
	}

	if (isLoading) return <LoadingSpinner />;
	return (
		<div className="flex flex-col w-full p-2 max-w-theme gap-2">
			<Navigation label="panel" path={staticURLs.client.account.base} />

			<FormSection title=" ticket">
				<ButtonBase onClick={onCrateTicketModal}>create tickets</ButtonBase>

				<InfiniteScroll
					pageStart={0}
					loadMore={getMore}
					hasMore={hasMore}
					loader={<LoadingSpinner key={"loader"} />}
					useWindow={true}
					initialLoad={true}
					threshold={150}
				>
					<div key="jobList" className="flex flex-col w-full gap-2 max-w-theme">
						{ticketsInfo?.items.map((ticket) => (
							<TicketPanelCard ticket={ticket} key={ticket.id} />
						))}
					</div>
				</InfiniteScroll>
			</FormSection>
		</div>
	);
}
