package handler

import (
	"github.com/labstack/echo/v4"
	"kuroko.com/analystics/internal/model"
)

// @Summary		Get All Path From Hop
// @Description	Get All Path From Hop
// @Tags			path
// @Accept			json
// @Produce		json
// @Param			caller_svc	query		string	true	"Caller Service"
// @Param			caller_op	query		string	true	"Caller Operation"
// @Param			called_svc	query		string	true	"Called Service"
// @Param			called_op	query		string	true	"Called Operation"
// @Success		200				{object}	[]model.GraphData
// @Failure		500				{object}	model.Error
// @Router			/paths [get]
func (h *Handler) GetAllPathFromHopHandler(c echo.Context) error {
	callerSvc := c.QueryParam("caller_svc")
	callerOp := c.QueryParam("caller_op")
	calledSvc := c.QueryParam("called_svc")
	calledOp := c.QueryParam("called_op")

	res, err := h.service.GetAllPathFromHop(c.Request().Context(), callerSvc, callerOp, calledSvc, calledOp)
	if err != nil {
		return c.JSON(500, model.Error{Message: err.Error(), Code: 500})
	}

	return c.JSON(200, res)
}

// @Summary		Get Path Detail By Id
// @Description	Get Path Detail By Id
// @Tags			path
// @Accept			json
// @Produce		json
// @Param			path_id			param		string	true	"Path Id"
// @Param			from				query		string	true	"From"
// @Param			to				query		string	true	"To"
// @Param			unit				query		string	true	"Unit"
// @Success		200				{object}	model.PathDetail
// @Failure		500				{object}	model.Error
// @Router			/paths/:path_id [get]
func (h *Handler) GetPathDetailByIdHandler(c echo.Context) error {
	pathId := c.Param("path_id")
	from := c.QueryParam("from")
	to := c.QueryParam("to")
	unit := c.QueryParam("unit")

	res, err := h.service.GetPathDetailById(c.Request().Context(), pathId, from, to, unit)
	if err != nil {
		return c.JSON(500, model.Error{Message: err.Error(), Code: 500})
	}

	return c.JSON(200, res)
}

// @Summary		Get Hop Detail
// @Description	Get Hop Detail
// @Tags			hop
// @Accept			json
// @Produce		json
// @Param			caller_service	query		string	true	"Caller Service"
// @Param			caller_operation	query		string	true	"Caller Operation"
// @Param			called_service	query		string	true	"Called Service"
// @Param			called_operation	query		string	true	"Called Operation"
// @Param			from				query		string	true	"From"
// @Param			to				query		string	true	"To"
// @Param			unit				query		string	true	"Unit"
// @Success		200				{object}	model.HopDetail
// @Failure		500				{object}	model.Error
// @Router			/hop-detail [get]
func (h *Handler) GetHopDetailByIdHandler(c echo.Context) error {
	callerSvc := c.QueryParam("caller_service")
	callerOp := c.QueryParam("caller_operation")
	calledSvc := c.QueryParam("called_service")
	calledOp := c.QueryParam("called_operation")
	from := c.QueryParam("from")
	to := c.QueryParam("to")
	unit := c.QueryParam("unit")

	res, err := h.service.GetHopDetailById(c.Request().Context(), callerSvc, callerOp, calledSvc, calledOp, from, to, unit)
	if err != nil {
		return c.JSON(500, model.Error{Message: err.Error(), Code: 500})
	}

	return c.JSON(200, res)
}

// @Summary		Get Long Path
// @Description	Get Long Path
// @Tags			path
// @Accept			json
// @Produce		json
// @Param			threshold		query		string	true	"Threshold"
// @Success		200				{object}	[]model.GraphData
// @Failure		500				{object}	model.Error
// @Router			/long-path [get]
func (h *Handler) GetLongPathHandler(c echo.Context) error {
	threshold := c.QueryParam("threshold")
	res, err := h.service.GetLongPath(c.Request().Context(), threshold)
	if err != nil {
		return c.JSON(500, model.Error{Message: err.Error(), Code: 500})
	}

	return c.JSON(200, res)
}
