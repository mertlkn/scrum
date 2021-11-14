package io.codeshake.scrumpokerbackend.mapper;

import io.codeshake.scrumpokerbackend.model.SessionDTO;
import io.codeshake.scrumpokerbackend.model.Session;
import org.mapstruct.Mapper;

@Mapper(componentModel="spring")
public interface SessionMapper {
    Session mapToSession(SessionDTO sessionDTO);
    SessionDTO mapToSessionDTO(Session session);
}
