package fr.polytech.info4.service.mapper;

import fr.polytech.info4.domain.*;
import fr.polytech.info4.service.dto.OrderDTO;
import org.mapstruct.*;

/**
 * Mapper for the entity {@link Order} and its DTO {@link OrderDTO}.
 */
@Mapper(componentModel = "spring", uses = { RestaurantMapper.class, DeliveryManMapper.class, ClientMapper.class })
public interface OrderMapper extends EntityMapper<OrderDTO, Order> {
    @Mapping(target = "restaurant", source = "restaurant", qualifiedByName = "restaurantId")
    @Mapping(target = "deliveryMan", source = "deliveryMan", qualifiedByName = "id")
    @Mapping(target = "client", source = "client", qualifiedByName = "id")
    OrderDTO toDto(Order s);
}
