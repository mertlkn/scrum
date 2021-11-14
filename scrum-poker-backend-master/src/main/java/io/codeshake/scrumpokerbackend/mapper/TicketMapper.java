package io.codeshake.scrumpokerbackend.mapper;

import io.codeshake.scrumpokerbackend.model.TicketDTO;
import io.codeshake.scrumpokerbackend.model.Ticket;
import org.mapstruct.Mapper;

@Mapper(componentModel="spring")
public interface TicketMapper {
    Ticket mapToTicket(TicketDTO ticketDTO);
    TicketDTO mapToTicketDTO(Ticket ticket);
}
